<?php
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$path = rtrim($path, '/');
$path = $path === '' ? '/' : $path;

$pages = [
    '/' => __DIR__ . '/../index.php',
    '/index.php' => __DIR__ . '/../index.php',
    '/contact.php' => __DIR__ . '/../contact.php',
    '/signup.php' => __DIR__ . '/../signup.php',
    '/privacy.php' => __DIR__ . '/../privacy.php',
    '/terms.php' => __DIR__ . '/../terms.php',
    '/cookies.php' => __DIR__ . '/../cookies.php',
    '/logout.php' => __DIR__ . '/../logout.php',
    '/admin-dashboard.php' => __DIR__ . '/../admin-dashboard.php',
];

if (strpos($path, '/api/') === 0) {
    require __DIR__ . '/../index.php';
    exit;
}

if (isset($pages[$path])) {
    require $pages[$path];
    exit;
}

http_response_code(404);
echo 'Page not found';

