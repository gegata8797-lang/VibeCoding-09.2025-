class CreditCalculator {
    constructor() {
        this.form = document.getElementById('creditForm');
        this.resultsDiv = document.getElementById('results');
        this.monthlyPaymentEl = document.getElementById('monthlyPayment');
        this.totalAmountEl = document.getElementById('totalAmount');
        this.totalInterestEl = document.getElementById('totalInterest');
        this.principalBar = document.getElementById('principalBar');
        this.interestBar = document.getElementById('interestBar');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateCredit();
        });
    }
    
    isFormValid() {
        const amount = parseFloat(document.getElementById('amount').value);
        const interest = parseFloat(document.getElementById('interest').value);
        const months = parseInt(document.getElementById('months').value);
        
        return amount > 0 && interest >= 0 && months > 0;
    }
    
    calculateCredit() {
        // Получаване на стойностите от формата
        const principal = parseFloat(document.getElementById('amount').value);
        const annualRate = parseFloat(document.getElementById('interest').value);
        const months = parseInt(document.getElementById('months').value);
        
        // Валидация
        if (!principal || !annualRate || !months) {
            return;
        }
        
        // Изчисления
        const monthlyRate = annualRate / 100 / 12;
        let monthlyPayment;
        
        if (monthlyRate === 0) {
            // Ако няма лихва
            monthlyPayment = principal / months;
        } else {
            // Формула за анюитетно плащане
            monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                           (Math.pow(1 + monthlyRate, months) - 1);
        }
        
        const totalAmount = monthlyPayment * months;
        const totalInterest = totalAmount - principal;
        
        // Показване на резултатите
        this.displayResults(monthlyPayment, totalAmount, totalInterest, principal);
    }
    
    displayResults(monthlyPayment, totalAmount, totalInterest, principal) {
        // Форматиране на числата
        this.monthlyPaymentEl.textContent = this.formatCurrency(monthlyPayment);
        this.totalAmountEl.textContent = this.formatCurrency(totalAmount);
        this.totalInterestEl.textContent = this.formatCurrency(totalInterest);
        
        // Обновяване на графиката
        this.updateChart(principal, totalInterest, totalAmount);
        
        // Показване на резултатите с анимация
        this.resultsDiv.classList.remove('hidden');
    }
    
    updateChart(principal, totalInterest, totalAmount) {
        const principalPercentage = (principal / totalAmount) * 100;
        const interestPercentage = (totalInterest / totalAmount) * 100;
        
        // Анимация на графиките
        setTimeout(() => {
            this.principalBar.style.height = `${Math.max(principalPercentage * 1.2, 20)}px`;
            this.interestBar.style.height = `${Math.max(interestPercentage * 1.2, 20)}px`;
        }, 100);
        
        // Добавяне на tooltips
        this.principalBar.title = `Главница: ${this.formatCurrency(principal)} (${principalPercentage.toFixed(1)}%)`;
        this.interestBar.title = `Лихви: ${this.formatCurrency(totalInterest)} (${interestPercentage.toFixed(1)}%)`;
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('bg-BG', {
            style: 'currency',
            currency: 'BGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
}

// Инициализация на калкулатора при зареждане на страницата
document.addEventListener('DOMContentLoaded', () => {
    new CreditCalculator();
    
    // Добавяне на примерни стойности за демонстрация
    document.getElementById('amount').value = '50000';
    document.getElementById('interest').value = '6.5';
    document.getElementById('months').value = '60';
});