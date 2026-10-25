<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${msg("loginTitle",(realm.displayName!'CarPartShop'))}</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <div class="header-section">
                <div class="brand-badge">
                    <i class="mdi mdi-car-turbocharger"></i>
                </div>
                <h1 class="brand-title">CarPart<span>Shop</span></h1>
                <p class="brand-subtitle">Logowanie do Portalu</p>
            </div>

            <#if message?has_content>
                <div class="alert alert-${message.type}">
                    <i class="mdi <#if message.type = 'error'>mdi-alert-circle<#else>mdi-information</#if>"></i>
                    <span>${kcSanitize(message.summary)?no_esc}</span>
                </div>
            </#if>

            <div class="quick-admin-box">
                <div class="quick-admin-header">
                    <span class="quick-admin-title"><i class="mdi mdi-account-star"></i> Konto administratora</span>
                    <span class="badge">Domyślne</span>
                </div>
                <p class="quick-admin-text">Login: <strong>admin</strong> | Hasło: <strong>admin</strong></p>
                <button type="button" class="btn-quick" onclick="fillAdmin()">Wypełnij dane administratora</button>
            </div>

            <form id="kc-form-login" class="login-form" action="${url.loginAction}" method="post">
                <div class="form-group">
                    <label for="username">Nazwa użytkownika lub email</label>
                    <div class="input-wrapper">
                        <i class="mdi mdi-account-outline input-icon"></i>
                        <input id="username" name="username" value="${(login.username!'')}" type="text" autofocus autocomplete="username" placeholder="np. admin" required />
                    </div>
                </div>

                <div class="form-group">
                    <label for="password">Hasło</label>
                    <div class="input-wrapper">
                        <i class="mdi mdi-lock-outline input-icon"></i>
                        <input id="password" name="password" type="password" autocomplete="current-password" placeholder="••••••••" required />
                    </div>
                </div>

                <button type="submit" class="btn-submit">
                    <i class="mdi mdi-login"></i> Zaloguj się
                </button>
            </form>

            <div class="footer-notice">
                <span>Zabezpieczone przez Keycloak OIDC &middot; CarPartShop</span>
            </div>
        </div>
    </div>

    <script>
        function fillAdmin() {
            document.getElementById('username').value = 'admin';
            document.getElementById('password').value = 'admin';
        }
    </script>
</body>
</html>
