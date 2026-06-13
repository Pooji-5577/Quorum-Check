<?php
// includes/PollManager.php - Database operations for polls

require_once __DIR__ . '/../config/database.php';

class PollManager {
    private $db;
    
    public function __construct() {
        $this->db = Database::getConnection();
    }
    
    /**
     * Get poll data with current vote counts
     */
    public function getPoll($poll_id) {
        // Get poll details
        $stmt = $this->db->prepare("SELECT * FROM polls WHERE poll_id = ? AND is_active = 1");
        $stmt->execute([$poll_id]);
        $poll = $stmt->fetch();
        
        if (!$poll) {
            return null;
        }
        
        // Get vote counts
        $vote_stmt = $this->db->prepare("
            SELECT option_key, COUNT(*) as vote_count 
            FROM poll_votes 
            WHERE poll_id = ? 
            GROUP BY option_key
        ");
        $vote_stmt->execute([$poll_id]);
        $votes = $vote_stmt->fetchAll();
        
        $vote_counts = [];
        foreach ($votes as $vote) {
            $vote_counts[$vote['option_key']] = $vote['vote_count'];
        }
        
        $poll['vote_counts'] = $vote_counts;
        $poll['options'] = json_decode($poll['options'], true);
        
        return $poll;
    }
    
    /**
     * Get vote percentages for a poll
     */
    public function getPollPercentages($poll_id) {
        $poll = $this->getPoll($poll_id);
        if (!$poll) {
            return [];
        }
        
        $total = array_sum($poll['vote_counts']);
        $percentages = [];
        
        foreach ($poll['options'] as $key => $label) {
            $count = $poll['vote_counts'][$key] ?? 0;
            $percentages[$key] = $total > 0 ? round(($count / $total) * 100) : 0;
        }
        
        return [
            'total' => $total,
            'percentages' => $percentages,
            'counts' => $poll['vote_counts']
        ];
    }
    
    /**
     * Cast a vote (prevents double voting using session)
     */
    public function castVote($poll_id, $option_key, $session_id, $ip_address = null, $user_agent = null) {
        // Check if user already voted
        $check_stmt = $this->db->prepare("
            SELECT id FROM poll_votes 
            WHERE poll_id = ? AND session_id = ?
        ");
        $check_stmt->execute([$poll_id, $session_id]);
        
        if ($check_stmt->fetch()) {
            return ['success' => false, 'error' => 'You have already voted on this poll'];
        }
        
        // Cast the vote
        try {
            $this->db->beginTransaction();
            
            // Query parameters match the unified installation schema columns cleanly
            $insert_stmt = $this->db->prepare("
                INSERT INTO poll_votes (poll_id, option_key, session_id, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?)
            ");
            $insert_stmt->execute([$poll_id, $option_key, $session_id, $ip_address, $user_agent]);
            
            // Update total votes count in polls table
            $update_stmt = $this->db->prepare("
                UPDATE polls SET total_votes = total_votes + 1 
                WHERE poll_id = ?
            ");
            $update_stmt->execute([$poll_id]);
            
            $this->db->commit();
            
            // Get updated percentages
            $percentages = $this->getPollPercentages($poll_id);
            
            return [
                'success' => true,
                'total' => $percentages['total'],
                'percentages' => $percentages['percentages'],
                'counts' => $percentages['counts']
            ];
            
        } catch (Exception $e) {
            $this->db->rollBack();
            error_log("Vote casting failed: " . $e->getMessage());
            return ['success' => false, 'error' => 'Failed to cast vote'];
        }
    }
    
    /**
     * Get recent vote activity for real-time updates
     */
    public function getRecentActivity($poll_id, $minutes = 5) {
        // FIXED: Changed voted_at to match database installation table schema 'created_at'
        $stmt = $this->db->prepare("
            SELECT option_key, COUNT(*) as votes_in_period
            FROM poll_votes
            WHERE poll_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL ? MINUTE)
            GROUP BY option_key
        ");
        $stmt->execute([$poll_id, $minutes]);
        return $stmt->fetchAll();
    }
    
    /**
     * Create a new poll
     */
    public function createPoll($poll_id, $title, $options, $description = null, $created_by = null) {
        $stmt = $this->db->prepare("
            INSERT INTO polls (poll_id, title, description, options, created_by)
            VALUES (?, ?, ?, ?, ?)
        ");
        return $stmt->execute([$poll_id, $title, $description, json_encode($options), $created_by]);
    }
}
?>