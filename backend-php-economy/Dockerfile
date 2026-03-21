FROM php:8.2-apache

# Install system dependencies + PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libicu-dev \
    && docker-php-ext-install pdo pdo_mysql mysqli intl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Update Apache DocumentRoot to CodeIgniter's public folder
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Allow .htaccess overrides (for CI4 mod_rewrite clean URLs)
RUN echo '<Directory /var/www/html/public>\n    AllowOverride All\n</Directory>' \
    >> /etc/apache2/apache2.conf

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies via Composer
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Ensure the writable directory exists and is owned by Apache user
RUN mkdir -p /var/www/html/writable/session \
             /var/www/html/writable/cache \
             /var/www/html/writable/logs \
    && chown -R www-data:www-data /var/www/html/writable

EXPOSE 80
