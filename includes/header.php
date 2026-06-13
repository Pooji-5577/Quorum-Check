<?php
// includes/header.php
?>
<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quorum Check - Real-Time Public Sentiment</title>
    <!-- Tailwind CSS Play CDN (For development/pre-launch preview) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                }
            }
        }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Site-Wide Favicon Elements -->
    <link rel="icon" type="image/x-icon" href="img/favicon/favicon.ico">
</head>
<body class="bg-white text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">

    <!-- Global Dynamic Banner Component Include -->
    <?php 
    if (file_exists(__DIR__ . '/banner.php')) {
        include_once __DIR__ . '/banner.php';
    }
    ?>

    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <!-- Brand Logo -->
            <div class="flex items-center gap-2">
                <a href="index.php" class="text-xl font-extrabold tracking-tight text-slate-900">
                    Quorum<span class="text-indigo-600">Check</span>
                </a>
            </div>

            <!-- Main Navigation Links -->
            <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                <a href="index.php#features" class="hover:text-indigo-600 transition-colors">Features</a>
                <a href="index.php#pricing" class="hover:text-indigo-600 transition-colors">Pricing</a>
                <a href="contact.php" class="hover:text-indigo-600 transition-colors">Contact</a>
            </nav>

            <!-- CTA Callouts -->
            <div class="hidden md:flex items-center gap-4">
                <a href="signup.php" class="inline-flex items-center justify-center bg-indigo-600 text-white font-semibold h-11 px-5 rounded-xl text-sm shadow-sm hover:bg-indigo-700 hover:shadow transition-all hover:scale-[1.01]">
                    Get Early Access
                </a>
            </div>

            <!-- Mobile Menu Toggle Button -->
            <button id="mobileMenuToggle" class="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none" aria-label="Toggle Menu">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path id="menuIcon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            </button>
        </div>

        <!-- Mobile Dropout Drawer Navigation -->
        <div id="mobileMenu" class="hidden md:hidden border-t border-slate-100 bg-white px-6 py-6 space-y-4 shadow-inner transition-all">
            <nav class="flex flex-col gap-4 text-base font-medium text-slate-600">
                <a href="index.php#features" class="mobile-link hover:text-indigo-600 py-1.5 transition">Features</a>
                <a href="index.php#pricing" class="mobile-link hover:text-indigo-600 py-1.5 transition">Pricing</a>
                <a href="contact.php" class="mobile-link hover:text-indigo-600 py-1.5 transition">Contact</a>
                <a href="signup.php" class="mobile-link text-center bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-sm hover:bg-indigo-700 transition mt-2">
                    Get Early Access
                </a>
            </nav>
        </div>
    </header>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const toggleBtn = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const menuIcon = document.getElementById('menuIcon');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        if (toggleBtn && mobileMenu) {
            toggleBtn.addEventListener('click', function() {
                const isHidden = mobileMenu.classList.contains('hidden');
                if (isHidden) {
                    mobileMenu.classList.remove('hidden');
                    menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12'); 
                } else {
                    mobileMenu.classList.add('hidden');
                    menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16'); 
                }
            });
        }

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
                }
            });
        });
    });
    </script>