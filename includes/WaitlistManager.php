<?php
// includes/WaitlistManager.php - Manages pre-launch waitlist signups

require_once __DIR__ . '/../config/database.php';

class WaitlistManager {
    private $db;
    
    public function __construct() {
        $this->db = Database::getConnection();
    }
    
    /**
     * Add email to waitlist
     * @param string $email User's email address
     * @param string $plan Selected plan (free, pro, enterprise)
     * @param string|null $ip_address User's IP address
     * @return bool Success status
     */
    public function addToWaitlist($email, $plan = 'free', $ip_address = null) {
        try {
            // Check if email already exists
            $check_stmt = $this->db->prepare("SELECT id FROM waitlist WHERE email = ?");
            $check_stmt->execute([$email]);
            
            if ($check_stmt->fetch()) {
                // Update existing record
                $stmt = $this->db->prepare("
                    UPDATE waitlist 
                    SET plan = ?, 
                        ip_address = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE email = ?
                ");
                return $stmt->execute([$plan, $ip_address, $email]);
            } else {
                // Insert new record
                $stmt = $this->db->prepare("
                    INSERT INTO waitlist (email, plan, ip_address, created_at)
                    VALUES (?, ?, ?, NOW())
                ");
                return $stmt->execute([$email, $plan, $ip_address]);
            }
        } catch (PDOException $e) {
            error_log("Waitlist insert failed: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Check if email is already on waitlist
     * @param string $email Email to check
     * @return bool True if exists
     */
    public function isOnWaitlist($email) {
        $stmt = $this->db->prepare("SELECT id FROM waitlist WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch() !== false;
    }
    
    /**
     * Get total waitlist count
     * @return int Number of signups
     */
    public function getWaitlistCount() {
        $stmt = $this->db->query("SELECT COUNT(*) as count FROM waitlist");
        $result = $stmt->fetch();
        return $result['count'] ?? 0;
    }
    
    /**
     * Get waitlist entries with pagination
     * @param int $limit Number of records
     * @param int $offset Offset for pagination
     * @return array List of waitlist entries
     */
    public function getWaitlistEntries($limit = 100, $offset = 0) {
        $stmt = $this->db->prepare("
            SELECT email, plan, ip_address, created_at 
            FROM waitlist 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$limit, $offset]);
        return $stmt->fetchAll();
    }
    
    /**
     * Get waitlist statistics by plan
     * @return array Plan distribution
     */
    public function getPlanStats() {
        $stmt = $this->db->query("
            SELECT plan, COUNT(*) as count 
            FROM waitlist 
            GROUP BY plan
        ");
        return $stmt->fetchAll();
    }
    
    /**
     * Remove email from waitlist
     * @param string $email Email to remove
     * @return bool Success status
     */
    public function removeFromWaitlist($email) {
        $stmt = $this->db->prepare("DELETE FROM waitlist WHERE email = ?");
        return $stmt->execute([$email]);
    }
    
    /**
     * Export waitlist to CSV
     * @return string CSV content
     */
    public function exportToCSV() {
        $entries = $this->getWaitlistEntries(10000, 0);
        
        $output = fopen('php://temp', 'r+');
        fputcsv($output, ['Email', 'Plan', 'IP Address', 'Signup Date']);
        
        foreach ($entries as $entry) {
            fputcsv($output, [
                $entry['email'],
                $entry['plan'],
                $entry['ip_address'],
                $entry['created_at']
            ]);
        }
        
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        
        return $csv;
    }
}
?>