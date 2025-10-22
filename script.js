 // Загрузочный экран
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    const mainContent = document.getElementById('mainContent');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    mainContent.style.display = 'block';
                }, 500);
            }, 500);
        }
        loadingProgress.style.width = `${progress}%`;
    }, 200);
});

document.addEventListener('DOMContentLoaded', function() {
    let moneyCount = 0;
    const MAX_MONEY_ELEMENTS = 100; 
    let moneyInterval;

    function createMoney() {
        const moneyRain = document.querySelector('.money-rain');
        if (!moneyRain) return;
        
        // Если достигли максимума, не создаем новые
        if (moneyCount >= MAX_MONEY_ELEMENTS) {
            return;
        }
        
        const money = document.createElement('div');
        money.className = 'money';
        money.textContent = '💰';
        money.style.left = Math.random() * 100 + 'vw';
        money.style.animationDuration = (Math.random() * 2 + 3) + 's'; // 3-5 секунд
        money.style.fontSize = (Math.random() * 10 + 15) + 'px'; // Разный размер
        
        moneyRain.appendChild(money);
        moneyCount++;

        // Автоматически удаляем после анимации
        setTimeout(() => {
            if (money.parentNode) {
                money.parentNode.removeChild(money);
                moneyCount--;
            }
        }, 5000);
    }

    // Запускаем реже - каждые 500мс
    const moneyRain = document.querySelector('.money-rain');
    if (moneyRain) {
        moneyInterval = setInterval(createMoney, 200);
        
        // Останавливаем через 30 секунд чтобы не нагружать
        setTimeout(() => {
            clearInterval(moneyInterval);
        }, 30000);
    }
});

        // Мобильное меню
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.getElementById('nav');
        
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.innerHTML = nav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Липкий хедер
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Анимация появления элементов при скролле
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const fadeInOnScroll = () => {
            fadeElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('visible');
                }
            });
        };
        
        window.addEventListener('scroll', fadeInOnScroll);
        fadeInOnScroll(); // Запускаем при загрузке

        // Игра кликер
        let gameState = {
            viewers: 0,
            clickPower: 1,
            donts: 0,
            autoClickers: 0,
            level: 1,
            exp: 0,
            expToNextLevel: 100,
            achievements: 0,
            upgrades: {
                chat: { purchased: false, cost: 50, effect: 'clickPower', value: 2 },
                emotes: { purchased: false, cost: 100, effect: 'clickPower', value: 3 },
                mods: { purchased: false, cost: 200, effect: 'clickPower', value: 5 },
                partner: { purchased: false, cost: 500, effect: 'clickPower', value: 10 },
                editor: { purchased: false, cost: 1000, effect: 'autoClickers', value: 2 },
                moderator: { purchased: false, cost: 5000, effect: 'autoClickers', value: 5 }
            },
            achievementsList: [
                { id: 'firstClick', name: 'Первый зритель', description: 'Привлеки первого зрителя', unlocked: false },
                { id: 'hundredViewers', name: 'Популярность', description: 'Собери 100 зрителей', unlocked: false },
                { id: 'thousandViewers', name: 'Звезда стриминга', description: 'Собери 1000 зрителей', unlocked: false },
                { id: 'firstDonation', name: 'Первый донат', description: 'Получи первый донат', unlocked: false },
                { id: 'allUpgrades', name: 'Максимальная прокачка', description: 'Купи все улучшения', unlocked: false }
            ]
        };

        function updateGameDisplay() {
            document.getElementById('viewersCount').textContent = gameState.viewers;
            document.getElementById('clickPower').textContent = gameState.clickPower;
            document.getElementById('dontsCount').textContent = gameState.donts;
            document.getElementById('autoClickers').textContent = gameState.autoClickers;
            document.getElementById('level').textContent = gameState.level;
            document.getElementById('expProgress').style.width = `${(gameState.exp / gameState.expToNextLevel) * 100}%`;
            document.getElementById('achievementsCount').textContent = gameState.achievements;
            
            // Обновляем кнопки улучшений
            for (const upgradeId in gameState.upgrades) {
                const upgrade = gameState.upgrades[upgradeId];
                const button = document.getElementById(`${upgradeId}Upgrade`);
                if (button) {
                    if (upgrade.purchased) {
                        button.disabled = true;
                        button.innerHTML = `<i class="fas fa-check"></i><br>Куплено<br><span class="upgrade-cost">💎 Приобретено</span>`;
                    } else {
                        button.disabled = gameState.viewers < upgrade.cost;
                        button.querySelector('.upgrade-cost').textContent = `💎 ${upgrade.cost} зрителей`;
                    }
                }
            }
            
            // Обновляем достижения
            updateAchievementsDisplay();
        }

        function clickMelstroy() {
            gameState.viewers += gameState.clickPower;
            gameState.exp += gameState.clickPower;
            
            // Случайный донат
            if (Math.random() < 0.1) {
                gameState.donts++;
                showDonationEffect();
            }
            
            // Проверка уровня
            if (gameState.exp >= gameState.expToNextLevel) {
                gameState.level++;
                gameState.exp = 0;
                gameState.expToNextLevel = Math.floor(gameState.expToNextLevel * 1.5);
                showLevelUpEffect();
            }
            
            // Проверка достижений
            checkAchievements();
            
            updateGameDisplay();
            showClickEffect();
        }

        function buyUpgrade(upgradeId) {
            const upgrade = gameState.upgrades[upgradeId];
            
            if (!upgrade.purchased && gameState.viewers >= upgrade.cost) {
                gameState.viewers -= upgrade.cost;
                upgrade.purchased = true;
                
                if (upgrade.effect === 'clickPower') {
                    gameState.clickPower += upgrade.value;
                } else if (upgrade.effect === 'autoClickers') {
                    gameState.autoClickers += upgrade.value;
                }
                
                updateGameDisplay();
            }
        }

        function showClickEffect() {
            const effect = document.getElementById('clickEffect');
            effect.style.background = 'radial-gradient(circle, rgba(138,43,226,0.7) 0%, transparent 70%)';
            effect.style.opacity = '1';
            
            setTimeout(() => {
                effect.style.opacity = '0';
            }, 300);
        }

        function showDonationEffect() {
            const donation = document.createElement('div');
            donation.style.position = 'absolute';
            donation.style.top = '50%';
            donation.style.left = '50%';
            donation.style.transform = 'translate(-50%, -50%)';
            donation.style.color = 'gold';
            donation.style.fontSize = '2rem';
            donation.style.fontWeight = 'bold';
            donation.style.zIndex = '10';
            donation.textContent = '💎 ДОНАТ!';
            document.querySelector('.clicker-game').appendChild(donation);
            
            setTimeout(() => {
                donation.remove();
            }, 1000);
        }

        function showLevelUpEffect() {
            const levelUp = document.createElement('div');
            levelUp.style.position = 'absolute';
            levelUp.style.top = '50%';
            levelUp.style.left = '50%';
            levelUp.style.transform = 'translate(-50%, -50%)';
            levelUp.style.color = '#00FFFF';
            levelUp.style.fontSize = '3rem';
            levelUp.style.fontWeight = 'bold';
            levelUp.style.zIndex = '10';
            levelUp.textContent = `Уровень ${gameState.level}!`;
            document.querySelector('.clicker-game').appendChild(levelUp);
            
            setTimeout(() => {
                levelUp.remove();
            }, 1500);
        }

        function checkAchievements() {
            // Первый зритель
            if (gameState.viewers >= 1 && !gameState.achievementsList[0].unlocked) {
                unlockAchievement(0);
            }
            
            // 100 зрителей
            if (gameState.viewers >= 100 && !gameState.achievementsList[1].unlocked) {
                unlockAchievement(1);
            }
            
            // 1000 зрителей
            if (gameState.viewers >= 1000 && !gameState.achievementsList[2].unlocked) {
                unlockAchievement(2);
            }
            
            // Первый донат
            if (gameState.donts >= 1 && !gameState.achievementsList[3].unlocked) {
                unlockAchievement(3);
            }
            
            // Все улучшения
            let allUpgradesPurchased = true;
            for (const upgradeId in gameState.upgrades) {
                if (!gameState.upgrades[upgradeId].purchased) {
                    allUpgradesPurchased = false;
                    break;
                }
            }
            
            if (allUpgradesPurchased && !gameState.achievementsList[4].unlocked) {
                unlockAchievement(4);
            }
        }

        function unlockAchievement(index) {
            gameState.achievementsList[index].unlocked = true;
            gameState.achievements++;
            
            const achievement = gameState.achievementsList[index];
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement unlocked';
            achievementElement.innerHTML = `
                <i class="fas fa-trophy"></i>
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
            `;
            
            document.getElementById('achievementsList').appendChild(achievementElement);
            
            // Показываем уведомление о достижении
            showAchievementNotification(achievement.name);
        }

        function showAchievementNotification(name) {
            const notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
            notification.style.color = 'white';
            notification.style.padding = '15px 25px';
            notification.style.borderRadius = '10px';
            notification.style.zIndex = '1000';
            notification.style.boxShadow = 'var(--shadow)';
            notification.innerHTML = `
                <i class="fas fa-trophy"></i> Достижение разблокировано: ${name}
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        function updateAchievementsDisplay() {
            const achievementsList = document.getElementById('achievementsList');
            achievementsList.innerHTML = '';
            
            gameState.achievementsList.forEach(achievement => {
                const achievementElement = document.createElement('div');
                achievementElement.className = `achievement ${achievement.unlocked ? 'unlocked' : ''}`;
                achievementElement.innerHTML = `
                    <i class="fas ${achievement.unlocked ? 'fa-trophy' : 'fa-lock'}"></i>
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                `;
                
                achievementsList.appendChild(achievementElement);
            });
        }

        // Автокликеры
        setInterval(() => {
            if (gameState.autoClickers > 0) {
                gameState.viewers += gameState.autoClickers;
                updateGameDisplay();
            }
        }, 1000);

        // Инициализация игры
        updateGameDisplay();
        updateAchievementsDisplay();