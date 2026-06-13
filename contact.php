<?php
session_start();
require_once 'config/database.php';

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$success_message = '';
$error_message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        $error_message = 'Security validation failed. Please try again.';
    } else {
        $name = trim($_POST['name'] ?? '');
        $email = trim(filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL));
        $subject = trim($_POST['subject'] ?? '');
        $message = trim($_POST['message'] ?? '');
        $inquiry_type = $_POST['inquiry_type'] ?? 'general';
        $newsletter = isset($_POST['newsletter']) ? 1 : 0;
        $ip_address = $_SERVER['HTTP_CLIENT_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? null;
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;
        $errors = [];

        if (empty($name) || strlen($name) < 2) {
            $errors[] = 'Please enter your full name.';
        }
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Please enter a valid email address.';
        }
        if (empty($subject)) {
            $errors[] = 'Please enter a subject.';
        }
        if (empty($message) || strlen($message) < 10) {
            $errors[] = 'Please enter a message of at least 10 characters.';
        }

        if (empty($errors)) {
            try {
                $db = Database::getConnection();
                $sql = "INSERT INTO contacts (name, email, inquiry_type, subject, message, newsletter, ip_address, user_agent, status)
                        VALUES (:name, :email, :inquiry_type, :subject, :message, :newsletter, :ip_address, :user_agent, 'new')";
                $stmt = $db->prepare($sql);
                $stmt->execute([
                    ':name' => $name,
                    ':email' => $email,
                    ':inquiry_type' => $inquiry_type,
                    ':subject' => $subject,
                    ':message' => $message,
                    ':newsletter' => $newsletter,
                    ':ip_address' => $ip_address,
                    ':user_agent' => $user_agent
                ]);
                $success_message = 'Thank you for reaching out. The Quorum Check team will reply within 24 hours.';
                $_POST = [];
                $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
            } catch (PDOException $e) {
                error_log("Database error in contact form: " . $e->getMessage());
                $error_message = 'We encountered a technical issue. Please try again later or email hello@quorumcheck.com.';
            }
        } else {
            $error_message = implode('<br>', array_map('htmlspecialchars', $errors));
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Quorum Check - Verified Polling and Public Opinion Support</title>
    <meta name="description" content="Contact Quorum Check about verified community polls, debate mode, AI insights, sentiment maps, organization dashboards, and anonymous accountable voting.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        display: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
                        sans: ['DM Sans', 'system-ui', 'sans-serif'],
                        mono: ['Space Grotesk', 'monospace']
                    },
                    colors: {
                        ink: '#111114',
                        lilac: '#f04a23',
                        blush: '#f6f7fb',
                        butter: '#fff4e8',
                        peach: '#ffd8c6',
                        mist: '#fbf7f2'
                    },
                    boxShadow: {
                        soft: '0 22px 70px rgba(23, 23, 31, 0.10)',
                        float: '0 16px 45px rgba(240, 74, 35, 0.18)'
                    }
                }
            }
        }
    </script>
    <style>
        :root { --grid: rgba(23, 23, 31, 0.075); }
        body {
            background:
                radial-gradient(circle at 16% 16%, rgba(255, 244, 232, 0.82), transparent 25rem),
                radial-gradient(circle at 84% 18%, rgba(246, 247, 251, 0.86), transparent 27rem),
                radial-gradient(circle at 76% 48%, rgba(240, 74, 35, 0.16), transparent 24rem),
                #ffffff;
        }
        .grid-mesh {
            background-image:
                linear-gradient(var(--grid) 1px, transparent 1px),
                linear-gradient(90deg, var(--grid) 1px, transparent 1px);
            background-size: 48px 48px;
            mask-image: radial-gradient(circle at center, black, transparent 72%);
        }
        .glass {
            background:
                linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.52)),
                linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0));
            border: 1px solid rgba(255, 255, 255, 0.72);
            box-shadow:
                inset 0 1px 0 rgba(255, 255, 255, 0.95),
                inset 0 -1px 0 rgba(17, 17, 20, 0.05),
                0 24px 78px rgba(17, 17, 20, 0.14);
            backdrop-filter: blur(28px) saturate(1.35);
        }
        .font-display {
            letter-spacing: -0.015em;
            font-variation-settings: "opsz" 48;
        }
        .pixel-field {
            position: absolute;
            pointer-events: none;
            opacity: 0.72;
            filter: blur(0.15px);
            mix-blend-mode: multiply;
        }
        .pixel-field::before,
        .pixel-field::after {
            content: "";
            position: absolute;
            inset: 0;
            background-size: 54px 54px, 108px 108px, 162px 162px;
            animation: pixelDrift 12s ease-in-out infinite alternate;
        }
        .pixel-field::before {
            background-image:
                linear-gradient(90deg, rgba(240, 74, 35, 0.72) 0 54px, transparent 54px),
                linear-gradient(90deg, rgba(255, 178, 63, 0.34) 0 54px, transparent 54px),
                linear-gradient(90deg, rgba(194, 45, 18, 0.14) 0 54px, transparent 54px);
            animation: pixelDrift 12s ease-in-out infinite alternate, pixelHue 7s steps(4, end) infinite;
        }
        .pixel-field::after {
            background-image:
                linear-gradient(0deg, rgba(240, 74, 35, 0.42) 0 54px, transparent 54px),
                linear-gradient(0deg, rgba(255, 198, 91, 0.22) 0 54px, transparent 54px),
                linear-gradient(0deg, rgba(194, 45, 18, 0.12) 0 54px, transparent 54px);
            animation: pixelDrift 12s ease-in-out infinite alternate-reverse, pixelHue 7s steps(4, end) infinite;
            animation-delay: -4s, -2s;
        }
        .pixel-field--contact {
            right: -8%;
            bottom: -20%;
            width: min(46vw, 520px);
            height: 340px;
            mask-image: linear-gradient(135deg, transparent 0%, black 38%, transparent 100%);
        }
        @keyframes pixelDrift {
            0% { transform: translate3d(-12px, 10px, 0); opacity: 0.68; }
            100% { transform: translate3d(16px, -14px, 0); opacity: 0.9; }
        }
        @keyframes pixelHue {
            0% { filter: hue-rotate(0deg) saturate(1); }
            25% { filter: hue-rotate(-7deg) saturate(1.1); }
            50% { filter: hue-rotate(8deg) saturate(1.18); }
            75% { filter: hue-rotate(16deg) saturate(1.08); }
            100% { filter: hue-rotate(0deg) saturate(1); }
        }
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after { animation: none !important; transition: none !important; }
        }
    </style>
</head>
<body class="font-sans text-ink antialiased selection:bg-lilac selection:text-white">
    <div class="pointer-events-none fixed inset-0 grid-mesh opacity-70"></div>

    <header class="sticky top-0 z-50 border-b border-black/5 bg-white/74 backdrop-blur-xl">
        <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-7">
            <a href="index.php" class="flex items-center gap-3">
                <span class="grid h-10 w-10 place-items-center rounded-full bg-ink text-white shadow-soft">
                    <span class="h-5 w-5 rounded-full border-[6px] border-white border-r-lilac"></span>
                </span>
                <span class="font-mono text-xl font-bold">Quorum Check</span>
            </a>
            <nav class="hidden items-center gap-2 rounded-full border border-black/5 bg-white/80 p-1 text-sm font-bold shadow-sm lg:flex">
                <a class="rounded-full px-4 py-2 hover:bg-black/5" href="index.php#feed">Feed</a>
                <a class="rounded-full px-4 py-2 hover:bg-black/5" href="index.php#map">Sentiment Map</a>
                <a class="rounded-full px-4 py-2 hover:bg-black/5" href="index.php#debate">Debate</a>
                <a class="rounded-full px-4 py-2 hover:bg-black/5" href="index.php#insights">Insights</a>
                <a class="rounded-full px-4 py-2 hover:bg-black/5" href="index.php#communities">Communities</a>
                <a class="rounded-full bg-black/5 px-4 py-2" href="contact.php">Contact</a>
            </nav>
            <a href="signup.php" class="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-soft">Join Now</a>
        </div>
    </header>

    <main class="relative z-10">
        <section class="mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-7 lg:pt-14">
            <div class="relative overflow-hidden rounded-[2rem] border border-black/8 bg-white/72 px-5 py-16 shadow-soft sm:px-10 lg:px-14">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(255,244,232,.82),transparent_24rem),radial-gradient(circle_at_76%_24%,rgba(246,247,251,.84),transparent_26rem),radial-gradient(circle_at_72%_68%,rgba(240,74,35,.16),transparent_22rem)]"></div>
                <div class="pixel-field pixel-field--contact"></div>
                <div class="absolute inset-8 grid-mesh opacity-70"></div>

                <div class="relative grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-center">
                    <div>
                        <p class="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Contact Quorum Check</p>
                        <h1 class="mt-5 font-display text-5xl font-black leading-[0.98] sm:text-7xl">Let us build better public opinion together.</h1>
                        <p class="mt-7 max-w-2xl text-lg leading-8 text-black/62">
                            Questions about verified polls, community insights, debate tools, organization dashboards, or anonymous accountable voting? Our team is ready to help.
                        </p>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                        <article class="glass rotate-[-1deg] rounded-3xl p-5">
                            <p class="text-xs font-extrabold uppercase tracking-[0.22em] text-black/38">AI insight demo</p>
                            <p class="mt-3 text-lg font-extrabold">We can show how Quorum Check summarizes voting trends, key discussions, and regional sentiment.</p>
                        </article>
                        <article class="glass rotate-[1deg] rounded-3xl p-5">
                            <p class="text-xs font-extrabold uppercase tracking-[0.22em] text-black/38">Verified onboarding</p>
                            <p class="mt-3 text-lg font-extrabold">Colleges, businesses, local governments, and organizations can run official community polls.</p>
                        </article>
                    </div>
                </div>
            </div>
        </section>

        <section class="mx-auto grid max-w-7xl gap-6 px-5 pb-20 sm:px-7 lg:grid-cols-[1.05fr_.95fr]">
            <div class="rounded-[2rem] border border-black/8 bg-white p-6 shadow-soft sm:p-8">
                <div class="mb-7 border-b border-black/6 pb-6">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.22em] text-lilac">Send a message</p>
                    <h2 class="mt-2 text-3xl font-extrabold">Tell us what you want to build with polls.</h2>
                </div>

                <?php if ($success_message): ?>
                    <div class="mb-6 rounded-2xl border border-lilac/20 bg-[#fff4e8] p-4 text-sm font-bold text-lilac"><?php echo htmlspecialchars($success_message); ?></div>
                <?php endif; ?>

                <?php if ($error_message): ?>
                    <div class="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700"><?php echo $error_message; ?></div>
                <?php endif; ?>

                <form method="POST" action="contact.php" class="space-y-5">
                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">
                    <div class="grid gap-5 md:grid-cols-2">
                        <div>
                            <label for="name" class="mb-2 block text-sm font-extrabold">Full Name *</label>
                            <input id="name" name="name" type="text" required value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>" class="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-lilac focus:ring-4 focus:ring-lilac/10">
                        </div>
                        <div>
                            <label for="email" class="mb-2 block text-sm font-extrabold">Email Address *</label>
                            <input id="email" name="email" type="email" required value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>" class="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-lilac focus:ring-4 focus:ring-lilac/10">
                        </div>
                    </div>
                    <div>
                        <label for="inquiry_type" class="mb-2 block text-sm font-extrabold">Inquiry Type</label>
                        <select id="inquiry_type" name="inquiry_type" class="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-lilac focus:ring-4 focus:ring-lilac/10">
                            <option value="general">General question</option>
                            <option value="verified">Verified community polls</option>
                            <option value="ai">AI insights demo</option>
                            <option value="privacy">Anonymous voting and trust</option>
                            <option value="enterprise">Organization dashboard</option>
                            <option value="partnership">Partnership</option>
                        </select>
                    </div>
                    <div>
                        <label for="subject" class="mb-2 block text-sm font-extrabold">Subject *</label>
                        <input id="subject" name="subject" type="text" required value="<?php echo htmlspecialchars($_POST['subject'] ?? ''); ?>" class="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-lilac focus:ring-4 focus:ring-lilac/10">
                    </div>
                    <div>
                        <label for="message" class="mb-2 block text-sm font-extrabold">Message *</label>
                        <textarea id="message" name="message" rows="6" required class="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-lilac focus:ring-4 focus:ring-lilac/10"><?php echo htmlspecialchars($_POST['message'] ?? ''); ?></textarea>
                    </div>
                    <label class="flex items-center gap-3 text-sm font-bold text-black/58">
                        <input type="checkbox" name="newsletter" value="1" <?php echo isset($_POST['newsletter']) ? 'checked' : ''; ?> class="h-4 w-4 rounded border-black/20 text-lilac">
                        Subscribe to product updates, launch notes, and public-opinion research.
                    </label>
                    <button type="submit" class="w-full rounded-full bg-ink px-7 py-4 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5">Send Message</button>
                    <p class="text-center text-xs text-black/42">By submitting, you agree to our privacy-first contact policy.</p>
                </form>
            </div>

            <aside class="space-y-5">
                <div class="rounded-[2rem] border border-black/8 bg-white p-6 shadow-soft">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.22em] text-lilac">Support areas</p>
                    <div class="mt-5 grid gap-3">
                        <?php
                        $areas = [
                            'Verified community onboarding',
                            'Organization polling setup',
                            'AI insight and debate demos',
                            'Real-time sentiment map configuration',
                            'Anonymous accountable voting',
                            'Moderation, anti-spam, and bot protection',
                        ];
                        foreach ($areas as $area):
                        ?>
                        <div class="rounded-2xl border border-white/60 bg-white/60 p-4 text-sm font-extrabold shadow-sm backdrop-blur-xl"><?php echo htmlspecialchars($area); ?></div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="glass rounded-[2rem] p-6">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.22em] text-black/38">Live product preview</p>
                    <h3 class="mt-3 text-2xl font-extrabold">Sentiment is shifting in verified campus polls.</h3>
                    <div class="mt-5 space-y-3">
                        <div>
                            <div class="mb-1 flex justify-between text-sm font-bold"><span>AI tutors in courses</span><span>61%</span></div>
                            <div class="h-2 rounded-full bg-black/5"><div class="h-2 w-[61%] rounded-full bg-lilac"></div></div>
                        </div>
                        <div>
                            <div class="mb-1 flex justify-between text-sm font-bold"><span>Anonymous feedback</span><span>84%</span></div>
                            <div class="h-2 rounded-full bg-black/5"><div class="h-2 w-[84%] rounded-full bg-[#2457ff]"></div></div>
                        </div>
                    </div>
                </div>

                <div class="rounded-[2rem] bg-ink p-6 text-white shadow-soft">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/42">Response promise</p>
                    <p class="mt-3 text-2xl font-extrabold">24-hour reply for product, community, and enterprise questions.</p>
                </div>
            </aside>
        </section>
    </main>

    <footer class="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-7">
        <div class="flex flex-col justify-between gap-4 border-t border-black/8 pt-8 text-sm text-black/50 sm:flex-row">
            <p class="font-bold text-ink">Quorum Check</p>
            <p>Social polling, debate, sentiment maps, AI insights, and verified community decision-making.</p>
            <p>&copy; <?php echo date('Y'); ?> Quorum Check.</p>
        </div>
    </footer>
</body>
</html>
