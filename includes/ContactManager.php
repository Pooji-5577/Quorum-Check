<?php
// includes/ContactManager.php - Manages contact form submissions

require_once __DIR__ . '/../config/database.php';

class ContactManager {
    private $db;
    
    public function __construct() {
        $this->db = Database::getConnection();
    }
    
    /**
     * Save contact form submission
     * @param array $data Contact form data
     * @return int|false Insert ID or false on failure
     */
    public function saveContact($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO contacts (
                    name, email, inquiry_type, subject, message, 
                    newsletter, ip_address, user_agent, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', NOW())
            ");
            
            $stmt->execute([
                $data['name'],
                $data['email'],
                $data['inquiry_type'] ?? 'general',
                $data['subject'],
                $data['message'],
                $data['newsletter'] ?? 0,
                $data['ip_address'] ?? null,
                $data['user_agent'] ?? null
            ]);
            
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log("Contact save failed: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get all contact submissions
     * @param string $status Filter by status (new, read, replied, archived)
     * @return array List of contacts
     */
    public function getContacts($status = null) {
        if ($status) {
            $stmt = $this->db->prepare("
                SELECT * FROM contacts 
                WHERE status = ? 
                ORDER BY created_at DESC
            ");
            $stmt->execute([$status]);
        } else {
            $stmt = $this->db->query("
                SELECT * FROM contacts 
                ORDER BY created_at DESC
            ");
        }
        return $stmt->fetchAll();
    }
    
    /**
     * Update contact status
     * @param int $id Contact ID
     * @param string $status New status
     * @return bool Success status
     */
    public function updateStatus($id, $status) {
        $stmt = $this->db->prepare("
            UPDATE contacts 
            SET status = ?, updated_at = NOW() 
            WHERE id = ?
        ");
        return $stmt->execute([$status, $id]);
    }
    
    /**
     * Get unread contact count
     * @return int Number of unread contacts
     */
    public function getUnreadCount() {
        $stmt = $this->db->query("
            SELECT COUNT(*) as count 
            FROM contacts 
            WHERE status = 'new'
        ");
        $result = $stmt->fetch();
        return $result['count'] ?? 0;
    }
    
    /**
     * Get contact by ID
     * @param int $id Contact ID
     * @return array|false Contact data
     */
    public function getContact($id) {
        $stmt = $this->db->prepare("SELECT * FROM contacts WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    /**
     * Delete contact
     * @param int $id Contact ID
     * @return bool Success status
     */
    public function deleteContact($id) {
        $stmt = $this->db->prepare("DELETE FROM contacts WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
?>