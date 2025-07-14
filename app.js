class DonationApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.tonConnect = null;
        this.wallet = null;
        this.recipient = null;
        this.amount = 0;
        this.message = '';
        this.minAmount = 0.5;
        
        this.init();
    }

    async init() {
        try {
            // Инициализация Telegram WebApp
            this.tg.ready();
            this.tg.expand();
            
            // Настройка темы
            this.setupTheme();
            
            // Инициализация TON Connect
            await this.initTonConnect();
            
            // Получение данных получателя
            await this.loadRecipientData();
            
            // Настройка обработчиков
            this.setupEventListeners();
            
            // Скрытие загрузки и показ основного контента
            this.hideLoading();
            
        } catch (error) {
            console.error('Ошибка инициализации:', error);
            this.showError('Ошибка загрузки приложения');
        }
    }

    setupTheme() {
        // Настройка цветовой схемы на основе темы Telegram
        if (this.tg.themeParams) {
            const root = document.documentElement;
            root.style.setProperty('--tg-theme-bg-color', this.tg.themeParams.bg_color || '#ffffff');
            root.style.setProperty('--tg-theme-text-color', this.tg.themeParams.text_color || '#000000');
            root.style.setProperty('--tg-theme-hint-color', this.tg.themeParams.hint_color || '#8E8E93');
            root.style.setProperty('--tg-theme-link-color', this.tg.themeParams.link_color || '#007AFF');
            root.style.setProperty('--tg-theme-button-color', this.tg.themeParams.button_color || '#007AFF');
            root.style.setProperty('--tg-theme-button-text-color', this.tg.themeParams.button_text_color || '#ffffff');
        }
    }

    async initTonConnect() {
        // Инициализация TON Connect
        this.tonConnect = new TonConnectUI({
            manifestUrl: `${window.location.origin}/tonconnect-manifest.json`,
            buttonRootId: null // Мы будем управлять кнопкой вручную
        });

        // Отслеживание изменений кошелька
        this.tonConnect.onStatusChange(wallet => {
            this.wallet = wallet;
            this.updateWalletUI();
            this.updateSendButton();
        });
    }

    async loadRecipientData() {
        try {
            // Отладочная информация
            console.log('🔍 Current URL:', window.location.href);
            console.log('🔍 Search params:', window.location.search);
            
            // Получаем параметры из URL
            const urlParams = new URLSearchParams(window.location.search);
            const recipientId = urlParams.get('recipient_id');
            const recipientName = urlParams.get('recipient_name');
            const minAmount = urlParams.get('min_amount');
            const recipientWallet = urlParams.get('recipient_wallet');
            
            console.log('🔍 URL Parameters:');
            console.log('  recipient_id:', recipientId);
            console.log('  recipient_name:', recipientName);
            console.log('  min_amount:', minAmount);
            console.log('  recipient_wallet:', recipientWallet);
            
            if (!recipientId || !recipientName || !minAmount || !recipientWallet) {
                console.error('❌ Missing required parameters');
                throw new Error('Неверная ссылка для доната');
            }

            // Создаем объект получателя из URL параметров
            this.recipient = {
                public_id: recipientId,
                name: decodeURIComponent(recipientName),
                min_amount: parseFloat(minAmount),
                description: 'Поддержите стримера!',
                wallet: decodeURIComponent(recipientWallet)
            };
            
            this.updateRecipientUI();
            
        } catch (error) {
            console.error('❌ Ошибка загрузки данных получателя:', error);
            console.error('❌ Error details:', error.message);
            this.showError('Получатель не найден: ' + error.message);
        }
    }

    updateRecipientUI() {
        if (!this.recipient) return;

        const nameElement = document.getElementById('streamer-name');
        const descriptionElement = document.getElementById('streamer-description');
        const initialElement = document.getElementById('streamer-initial');
        const minAmountElement = document.getElementById('min-amount');

        nameElement.textContent = this.recipient.name;
        descriptionElement.textContent = this.recipient.description || 'Поддержите стримера!';
        initialElement.textContent = this.recipient.name.charAt(0).toUpperCase();
        
        // Обновляем минимальную сумму
        this.minAmount = this.recipient.min_amount || 0.5;
        minAmountElement.textContent = this.minAmount;
        
        // Обновляем кнопки сумм на основе минимальной суммы
        this.updateAmountButtons();
    }

    updateAmountButtons() {
        const container = document.getElementById('amount-buttons');
        const amounts = [
            this.minAmount,
            this.minAmount * 2,
            this.minAmount * 10,
            this.minAmount * 20
        ];

        container.innerHTML = '';
        amounts.forEach(amount => {
            const button = document.createElement('button');
            button.className = 'amount-btn';
            button.setAttribute('data-amount', amount);
            button.textContent = `${amount} TON`;
            container.appendChild(button);
        });
    }

    setupEventListeners() {
        // Кнопки выбора суммы
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('amount-btn')) {
                this.selectAmount(parseFloat(e.target.getAttribute('data-amount')));
            }
        });

        // Поле пользовательской суммы
        const customAmountInput = document.getElementById('custom-amount');
        customAmountInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value > 0) {
                this.selectAmount(value);
            } else {
                this.amount = 0;
                this.updateFinalAmount();
                this.updateSendButton();
            }
        });

        // Счетчик символов в сообщении
        const messageInput = document.getElementById('donation-message');
        const charCounter = document.getElementById('char-counter');
        messageInput.addEventListener('input', (e) => {
            const length = e.target.value.length;
            charCounter.textContent = length;
            this.message = e.target.value;
        });

        // Подключение кошелька
        document.getElementById('connect-wallet-btn').addEventListener('click', () => {
            this.connectWallet();
        });

        // Отключение кошелька
        document.getElementById('disconnect-btn').addEventListener('click', () => {
            this.disconnectWallet();
        });

        // Отправка доната
        document.getElementById('send-donation').addEventListener('click', () => {
            this.showConfirmation();
        });

        // Модальные окна
        document.getElementById('confirm-send').addEventListener('click', () => {
            this.sendDonation();
        });

        document.getElementById('cancel-send').addEventListener('click', () => {
            this.hideModal('confirmation-modal');
        });

        document.getElementById('close-app').addEventListener('click', () => {
            this.tg.close();
        });

        document.getElementById('close-error').addEventListener('click', () => {
            this.hideModal('error-modal');
        });

        // Haptic feedback
        this.tg.HapticFeedback = this.tg.HapticFeedback || {
            impactOccurred: () => {},
            notificationOccurred: () => {},
            selectionChanged: () => {}
        };
    }

    selectAmount(amount) {
        this.amount = amount;
        
        // Обновляем визуальное состояние кнопок
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseFloat(btn.getAttribute('data-amount')) === amount) {
                btn.classList.add('active');
            }
        });

        // Обновляем поле пользовательской суммы
        document.getElementById('custom-amount').value = amount;
        
        // Обновляем финальную сумму
        this.updateFinalAmount();
        this.updateSendButton();

        // Haptic feedback
        this.tg.HapticFeedback.selectionChanged();
    }

    updateFinalAmount() {
        const finalAmount = this.amount * 0.95; // 5% комиссия
        document.getElementById('final-amount').textContent = finalAmount.toFixed(2);
    }

    async connectWallet() {
        try {
            await this.tonConnect.openModal();
            this.tg.HapticFeedback.impactOccurred('medium');
        } catch (error) {
            console.error('Ошибка подключения кошелька:', error);
            this.showError('Ошибка подключения кошелька');
        }
    }

    async disconnectWallet() {
        try {
            await this.tonConnect.disconnect();
            this.tg.HapticFeedback.impactOccurred('light');
        } catch (error) {
            console.error('Ошибка отключения кошелька:', error);
        }
    }

    updateWalletUI() {
        const connectSection = document.getElementById('wallet-connect');
        const connectedSection = document.getElementById('wallet-connected');

        if (this.wallet) {
            // Кошелек подключен
            connectSection.style.display = 'none';
            connectedSection.style.display = 'block';
            
            // Обновляем информацию о кошельке
            const addressElement = document.getElementById('wallet-address');
            const balanceElement = document.getElementById('wallet-balance');
            
            // Сокращаем адрес для отображения
            const shortAddress = this.wallet.account.address.slice(0, 6) + 
                               '...' + 
                               this.wallet.account.address.slice(-6);
            addressElement.textContent = shortAddress;
            
            // Получаем баланс (если доступно)
            this.updateWalletBalance();
            
        } else {
            // Кошелек не подключен
            connectSection.style.display = 'block';
            connectedSection.style.display = 'none';
        }
    }

    async updateWalletBalance() {
        try {
            // Здесь можно добавить запрос баланса через TON API
            document.getElementById('wallet-balance').textContent = '...';
        } catch (error) {
            console.error('Ошибка получения баланса:', error);
            document.getElementById('wallet-balance').textContent = 'н/д';
        }
    }

    updateSendButton() {
        const sendButton = document.getElementById('send-donation');
        const isValid = this.wallet && 
                       this.amount >= this.minAmount && 
                       this.recipient;
        
        sendButton.disabled = !isValid;
        
        if (isValid) {
            sendButton.textContent = `🚀 Отправить ${this.amount} TON`;
        } else if (!this.wallet) {
            sendButton.textContent = '🔗 Подключите кошелек';
        } else if (this.amount < this.minAmount) {
            sendButton.textContent = `💰 Мин. ${this.minAmount} TON`;
        } else {
            sendButton.textContent = '🚀 Отправить донат';
        }
    }

    showConfirmation() {
        if (!this.wallet || this.amount < this.minAmount) return;

        // Заполняем данные подтверждения
        document.getElementById('confirm-recipient').textContent = this.recipient.name;
        document.getElementById('confirm-amount').textContent = `${this.amount} TON`;
        document.getElementById('confirm-final').textContent = `${(this.amount * 0.95).toFixed(2)} TON`;
        
        const messageRow = document.getElementById('confirm-message-row');
        if (this.message.trim()) {
            document.getElementById('confirm-message').textContent = this.message;
            messageRow.style.display = 'flex';
        } else {
            messageRow.style.display = 'none';
        }

        this.showModal('confirmation-modal');
        this.tg.HapticFeedback.impactOccurred('light');
    }

    async sendDonation() {
        try {
            this.hideModal('confirmation-modal');
            
            // Создаем уникальный комментарий для транзакции
            const donationId = Date.now();
            const comment = `don${donationId}_${this.tg.initDataUnsafe?.user?.id || 'unknown'}`;
            
            // Формируем транзакцию
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 360, // 6 минут
                messages: [
                    {
                        address: this.recipient.wallet,
                        amount: (this.amount * 1000000000).toString(), // В наnotон
                        payload: this.createCommentPayload(comment)
                    }
                ]
            };

            // Отправляем транзакцию
            const result = await this.tonConnect.sendTransaction(transaction);
            
            if (result) {
                // Уведомления будут обработаны через систему мониторинга транзакций бота
                console.log('Транзакция отправлена, уведомления будут обработаны автоматически');
                
                this.showSuccess();
                this.tg.HapticFeedback.notificationOccurred('success');
            }
            
        } catch (error) {
            console.error('Ошибка отправки доната:', error);
            this.showError('Ошибка отправки доната');
            this.tg.HapticFeedback.notificationOccurred('error');
        }
    }

    createCommentPayload(comment) {
        try {
            // Создаем payload для комментария в TON транзакции
            const encoder = new TextEncoder();
            const commentBytes = encoder.encode(comment);
            
            // Простая имплементация для комментария
            // В реальном проекте лучше использовать @ton/core
            const payload = new Uint8Array(4 + commentBytes.length);
            payload.set([0, 0, 0, 0]); // op code для текстового комментария
            payload.set(commentBytes, 4);
            
            // Конвертируем в base64
            return btoa(String.fromCharCode(...payload));
        } catch (error) {
            console.error('Ошибка создания payload:', error);
            return null;
        }
    }

    // Метод notifyBackend удален - уведомления обрабатываются через систему мониторинга транзакций бота

    showSuccess() {
        this.showModal('success-modal');
    }

    showError(message) {
        document.getElementById('error-message').textContent = message;
        this.showModal('error-modal');
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new DonationApp();
});

// Обработка ошибок
window.addEventListener('error', (event) => {
    console.error('Глобальная ошибка:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Необработанное отклонение промиса:', event.reason);
}); 