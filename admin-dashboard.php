<?php
// Force error reporting while troubleshooting setup errors
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

// --- ACTIVE SECURITY SESSION ENFORCEMENT GATE ---
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    // Drop bad attempts back to login array
    header('Location: login.php');
    exit;
}

// Optional: Session Timeout protection (automatically logs out after 30 minutes of sitting idle)
$timeout_duration = 1800; 
if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time']) > $timeout_duration) {
    session_unset();
    session_destroy();
    header('Location: login.php?reason=timeout');
    exit;
}
$_SESSION['login_time'] = time(); // Reset active tracking timestamp parameter

require_once 'config/database.php';
$db = Database::getConnection();

// --- SEARCH, FILTER, & PAGINATION CONFIGURATION ---
$search = trim($_GET['search'] ?? '');
$filter_type = $_GET['type'] ?? 'all';
$filter_status = $_GET['status'] ?? 'all';

$page = max(1, (int)($_GET['page'] ?? 1));
$limit = 10; // Number of records per page
$offset = ($page - 1) * $limit;

// Base query construction
$where_clauses = [];
$params = [];

if (!empty($search)) {
    $where_clauses[] = "(name LIKE :search OR email LIKE :search OR subject LIKE :search OR message LIKE :search)";
    $params[':search'] = "%$search%";
}

if ($filter_type !== 'all') {
    $where_clauses[] = "inquiry_type = :type";
    $params[':type'] = $filter_type;
}

if ($filter_status !== 'all') {
    $where_clauses[] = "status = :status";
    $params[':status'] = $filter_status;
}

$where_sql = !empty($where_clauses) ? 'WHERE ' . implode(' AND ', $where_clauses) : '';

// 1. Get Total Count for Pagination calculation
$count_sql = "SELECT COUNT(*) FROM contacts $where_sql";
$count_stmt = $db->prepare($count_sql);
$count_stmt->execute($params);
$total_records = $count_stmt->fetchColumn();
$total_pages = ceil($total_records / $limit);

// 2. Fetch the Segmented Data Records
$data_sql = "SELECT * FROM contacts $where_sql ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
$data_stmt = $db->prepare($data_sql);
$data_stmt->execute($params);
$contacts = $data_stmt->fetchAll(PDO::FETCH_ASSOC);

// Include global layout partial layout shell
include_once 'includes/header.php';
?>

<main class="bg-slate-50 min-h-screen text-slate-800 antialiased py-12 px-6">
    <div class="max-w-7xl mx-auto space-y-8">
        
        <!-- Top Operational Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div>
                <span class="text-indigo-600 font-semibold text-xs tracking-wide uppercase">Core Management Dashboard</span>
                <h1 class="text-2xl font-extrabold text-slate-900 mt-1">Inbound Contact Submissions</h1>
                <p class="text-slate-500 text-sm mt-1">Reviewing <?php echo $total_records; ?> total customer records captured through your live portals.</p>
            </div>
            
            <div class="flex items-center gap-3">
                <a href="admin-dashboard.php" class="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
                    🔄 Refresh Grid
                </a>
                <a href="logout.php" class="px-4 py-2.5 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition">
    🔒 Terminate Session
</a>
            </div>
        </div>

        <!-- Filter Control Matrix Box -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <form method="GET" action="admin-dashboard.php" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                
                <div>
                    <label for="search" class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Search Records</label>
                    <input type="text" id="search" name="search" value="<?php echo htmlspecialchars($search); ?>" placeholder="Name, email, words..."
                           class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50">
                </div>

                <div>
                    <label for="type" class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Inquiry Type</label>
                    <select id="type" name="type" class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                        <option value="all" <?php echo $filter_type === 'all' ? 'selected' : ''; ?>>All Categories</option>
                        <option value="general" <?php echo $filter_type === 'general' ? 'selected' : ''; ?>>General Question</option>
                        <option value="sales" <?php echo $filter_type === 'sales' ? 'selected' : ''; ?>>Sales & Pricing</option>
                        <option value="support" <?php echo $filter_type === 'support' ? 'selected' : ''; ?>>Technical Support</option>
                        <option value="partnership" <?php echo $filter_type === 'partnership' ? 'selected' : ''; ?>>Partnership Opportunity</option>
                    </select>
                </div>

                <div>
                    <label for="status" class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Workflow Status</label>
                    <select id="status" name="status" class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                        <option value="all" <?php echo $filter_status === 'all' ? 'selected' : ''; ?>>All Statuses</option>
                        <option value="new" <?php echo $filter_status === 'new' ? 'selected' : ''; ?>>New / Unread</option>
                        <option value="replied" <?php echo $filter_status === 'replied' ? 'selected' : ''; ?>>Replied</option>
                        <option value="archived" <?php echo $filter_status === 'archived' ? 'selected' : ''; ?>>Archived</option>
                    </select>
                </div>

                <div class="flex gap-2">
                    <button type="submit" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-sm transition">
                        Apply Filters
                    </button>
                    <?php if (!empty($search) || $filter_type !== 'all' || $filter_status !== 'all'): ?>
                        <a href="admin-dashboard.php" class="px-3 py-2.5 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition flex items-center justify-center" title="Clear Filters">
                            ✕
                        </a>
                    <?php endif; ?>
                </div>
            </form>
        </div>

        <!-- Master Data Layout Table Grid -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold tracking-wide">
                            <th class="p-4">Submission Meta</th>
                            <th class="p-4">Sender Details</th>
                            <th class="p-4">Inquiry Category</th>
                            <th class="p-4">Subject & Excerpt</th>
                            <th class="p-4 text-center">Newsletter</th>
                            <th class="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-slate-600">
                        <?php if (empty($contacts)): ?>
                            <tr>
                                <td colspan="6" class="p-12 text-center text-slate-400 font-medium">
                                    No database entries found matching your current filter layouts.
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($contacts as $row): ?>
                                <tr class="hover:bg-slate-50/70 transition-colors">
                                    <td class="p-4 whitespace-nowrap">
                                        <div class="text-xs font-mono text-slate-400">ID: #<?php echo $row['id']; ?></div>
                                        <div class="text-xs text-slate-500 mt-1"><?php echo date('d M Y H:i', strtotime($row['created_at'])); ?></div>
                                    </td>
                                    <td class="p-4">
                                        <div class="font-semibold text-slate-900"><?php echo htmlspecialchars($row['name']); ?></div>
                                        <div class="text-xs text-indigo-600 font-mono mt-0.5"><?php echo htmlspecialchars($row['email']); ?></div>
                                    </td>
                                    <td class="p-4 whitespace-nowrap">
                                        <span class="px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide capitalize <?php
                                            echo match($row['inquiry_type']) {
                                                'sales' => 'bg-emerald-50 text-emerald-700 border border-emerald-100',
                                                'support' => 'bg-amber-50 text-amber-700 border border-amber-100',
                                                'partnership' => 'bg-purple-50 text-purple-700 border border-purple-100',
                                                default => 'bg-slate-100 text-slate-700 border border-slate-200'
                                            };
                                        ?>">
                                            <?php echo htmlspecialchars($row['inquiry_type']); ?>
                                        </span>
                                    </td>
                                    <td class="p-4 max-w-xs truncate">
                                        <div class="font-medium text-slate-800 truncate"><?php echo htmlspecialchars($row['subject']); ?></div>
                                        <div class="text-xs text-slate-400 mt-1 truncate"><?php echo htmlspecialchars($row['message']); ?></div>
                                    </td>
                                    <td class="p-4 text-center whitespace-nowrap">
                                        <?php if ($row['newsletter']): ?>
                                            <span class="inline-flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold px-2 py-0.5 border border-indigo-100">Subscribed</span>
                                        <?php else: ?>
                                            <span class="text-slate-300">—</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="p-4 text-right whitespace-nowrap">
                                        <!-- Open detailed view modal passing specific target properties -->
                                        <button type="button" onclick="openMessageModal(<?php echo htmlspecialchars(json_encode($row)); ?>)"
                                                class="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-xs rounded-lg shadow-sm hover:bg-slate-50 transition">
                                            Open Payload
                                        </button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

            <!-- Server-Side Pagination Controller -->
            <?php if ($total_pages > 1): ?>
                <div class="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div class="text-xs text-slate-500 font-medium">
                        Showing Page <span class="text-slate-800"><?php echo $page; ?></span> of <span class="text-slate-800"><?php echo $total_pages; ?></span> pages
                    </div>
                    <div class="flex items-center gap-1">
                        <a href="?page=<?php echo max(1, $page - 1); ?>&search=<?php echo urlencode($search); ?>&type=<?php echo urlencode($filter_type); ?>&status=<?php echo urlencode($filter_status); ?>" 
                           class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition <?php echo $page <= 1 ? 'pointer-events-none opacity-40' : ''; ?>">
                            Previous
                        </a>
                        <a href="?page=<?php echo min($total_pages, $page + 1); ?>&search=<?php echo urlencode($search); ?>&type=<?php echo urlencode($filter_type); ?>&status=<?php echo urlencode($filter_status); ?>" 
                           class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition <?php echo $page >= $total_pages ? 'pointer-events-none opacity-40' : ''; ?>">
                            Next
                        </a>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<!-- Dynamic Inspect Modal Window Blueprint Overlay -->
<div id="inspectorModal" class="fixed inset-0 z-[100] hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all animate-fade-in">
    <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl transform scale-95 transition-transform duration-300">
        
        <!-- Modal Top Title Wrapper -->
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div>
                <h3 class="font-bold text-slate-900 text-base" id="m_subject">Message Payload</h3>
                <p class="text-xs text-slate-400 mt-0.5" id="m_meta">Metadata logs</p>
            </div>
            <button onclick="closeMessageModal()" class="text-slate-400 hover:text-slate-600 font-medium text-lg focus:outline-none p-1">✕</button>
        </div>

        <!-- Main Payload Inspect Array Blocks -->
        <div class="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-600">
            <div class="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div>
                    <span class="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Sender Name</span>
                    <span class="font-bold text-slate-800" id="m_name">John Doe</span>
                </div>
                <div>
                    <span class="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Email Address</span>
                    <span class="font-mono text-indigo-600 font-medium" id="m_email">email@domain.com</span>
                </div>
            </div>

            <div>
                <span class="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Message Body Content</span>
                <div class="bg-white border border-slate-200 rounded-xl p-4 font-normal text-slate-800 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap" id="m_body">
                    Message contents render here...
                </div>
            </div>

            <div class="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4 text-xs font-mono text-slate-400">
                <div>
                    <span class="block font-semibold uppercase tracking-wider text-[10px] text-slate-400 mb-1">Inbound Connection IP</span>
                    <span id="m_ip">127.0.0.1</span>
                </div>
                <div>
                    <span class="block font-semibold uppercase tracking-wider text-[10px] text-slate-400 mb-1">System User-Agent</span>
                    <span class="truncate block max-w-xs" id="m_ua" title="">Mozilla Browser Client Profile</span>
                </div>
            </div>
        </div>

        <!-- Footer Escape Controls -->
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button onclick="closeMessageModal()" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition">
                Dismiss Window
            </button>
        </div>
    </div>
</div>

<script>
const modal = document.getElementById('inspectorModal');
const mSubject = document.getElementById('m_subject');
const mMeta = document.getElementById('m_meta');
const mName = document.getElementById('m_name');
const mEmail = document.getElementById('m_email');
const mBody = document.getElementById('m_body');
const mIp = document.getElementById('m_ip');
const mUa = document.getElementById('m_ua');

function openMessageModal(data) {
    if (!modal) return;
    
    // Inject dataset elements safely into UI fields
    mSubject.innerText = data.subject || 'No Subject';
    mMeta.innerText = `Record ID: #${data.id} · Logged at ${data.created_at}`;
    mName.innerText = data.name || 'Anonymous User';
    mEmail.innerText = data.email || 'No email log';
    mBody.innerText = data.message || '';
    mIp.innerText = data.ip_address || 'Not Recorded';
    mUa.innerText = data.user_agent || 'Not Available';
    mUa.title = data.user_agent || '';

    // Remove hidden display layers and pop-in smoothly
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden'); // Block baseline background scrolls
    setTimeout(() => {
        modal.firstElementChild.classList.remove('scale-95');
    }, 10);
}

function closeMessageModal() {
    if (!modal) return;
    modal.firstElementChild.classList.add('scale-95');
    setTimeout(() => {
        modal.add('hidden'); // Re-inject clean visibility mask layers
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }, 200);
}

// Global escape button listener hooks
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeMessageModal();
    }
});
</script>

<?php 
// Include global layout layout wrapper
include_once 'includes/footer.php'; 
?>