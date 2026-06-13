<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// signup.php - Pre-launch signup with database integration

session_start();
require_once 'config/database.php';
require_once 'includes/WaitlistManager.php';

$waitlistManager = new WaitlistManager();
$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $plan = $_POST['plan'] ?? 'free';
    
    if ($email) {
        if ($waitlistManager->addToWaitlist($email, $plan, $_SERVER['REMOTE_ADDR'])) {
            $message = 'Thank you! You\'re on the waitlist.';
        } else {
            $error = 'Unable to sign up. Please try again.';
        }
    } else {
        $error = 'Please enter a valid email address.';
    }
}


// Generate CSRF token if it doesn't exist
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$waitlistManager = new WaitlistManager();
$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify CSRF token
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        $error = 'Security validation failed. Please try again.';
    } else {
        $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $plan = $_POST['plan'] ?? 'free';
        
        if ($email) {
            $ip_address = $_SERVER['REMOTE_ADDR'] ?? null;
            if ($waitlistManager->addToWaitlist($email, $plan, $ip_address)) {
                $message = "Thank you! You're on the waitlist.";
                
                // Regenerate CSRF token on success
                $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
            } else {
                $error = 'Unable to sign up. You may already be registered or a technical issue occurred.';
            }
        } else {
            $error = 'Please enter a valid email address.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Pre-Launch Signup · Quorum Check Early Access</title>
    <!-- Google Fonts + Tailwind -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        slate: { 850: '#1e293b', 900: '#0f172a' },
                        indigo: { 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 400: '#818cf8' },
                    },
                    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
                }
            }
        }
    </script>
</head>
<body class="font-sans antialiased text-slate-800 bg-gradient-to-b from-white to-slate-50 min-h-screen flex flex-col justify-between">

    <?php include_once 'includes/header.php'; ?>

    <main class="max-w-lg mx-auto px-6 py-16 text-center flex-grow flex flex-col justify-center w-full">
        <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl overflow-hidden">
            <div class="text-4xl mb-4">🚀</div>
            <h1 class="text-3xl font-extrabold text-slate-900 mb-2">Get Early Access</h1>
            <p class="text-slate-500 mb-6 leading-relaxed">Be the first to know when Quorum Check launches. We prioritise your privacy: no spam, just major updates.</p>
            
            <?php if ($message): ?>
                <div class="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 text-left">
                    <div class="flex items-center gap-3">
                        <svg class="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p class="text-green-800 text-sm font-medium"><?php echo htmlspecialchars($message); ?></p>
                    </div>
                </div>
            <?php endif; ?>

            <?php if ($error): ?>
                <div class="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-left">
                    <div class="flex items-center gap-3">
                        <svg class="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p class="text-red-800 text-sm font-medium"><?php echo htmlspecialchars($error); ?></p>
                    </div>
                </div>
            <?php endif; ?>

            <form method="POST" action="signup.php" class="space-y-4 text-left">
                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                
                <div>
                    <label for="email" class="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input type="email" id="email" name="email" placeholder="you@example.com" required 
                           value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>"
                           class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                </div>

                <div>
                    <label for="plan" class="block text-sm font-medium text-slate-700 mb-2">Preferred Plan Tier</label>
                    <select id="plan" name="plan" class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white">
                        <option value="free" <?php echo (($_POST['plan'] ?? '') === 'free') ? 'selected' : ''; ?>>Free Plan</option>
                        <option value="pro" <?php echo (($_POST['plan'] ?? '') === 'pro') ? 'selected' : ''; ?>>Pro Plan</option>
                        <option value="enterprise" <?php echo (($_POST['plan'] ?? '') === 'enterprise') ? 'selected' : ''; ?>>Enterprise</option>
                    </select>
                </div>

                <button type="submit" class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition shadow-md hover:shadow-lg block text-center">
                    Join Waitlist
                </button>
            </form>
            <p class="text-xs text-slate-400 mt-4">We respect your data privacy. Unsubscribe at any time.</p>
        </div>
    </main>

    <?php include_once 'includes/footer.php'; ?>
</body>
</html>