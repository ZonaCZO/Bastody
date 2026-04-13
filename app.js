const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const currentDate = ref('');
        const currentTab = ref('today');
        const SWIPE_OFFSET_NORMAL = 170; // Для обычных карточек (hero, list, trending)
        const SWIPE_OFFSET_GRID = 100;   // Для сетки (grid-row)
        let activeSwipeCard = null;

        const tabs = ref([
            { id: 'today', name: 'Today', svg: `https://noxit.io/wp-content/uploads/2023/02/logo.svg` },
            { id: 'news', name: 'News+', svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M6 2h7.5L19 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 2v4h4L13 4z'/></svg>` },
            { id: 'sports', name: 'Sports', svg: `<svg fill="#000000" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M0,79.175v353.65h512V79.175H0z M263.918,190.513c32.659,3.926,58.062,31.787,58.062,65.487c0,33.7-25.403,61.561-58.062,65.487V190.513z M15.835,200.577h58.062v110.845H15.835V200.577z M248.082,321.487c-32.659-3.926-58.062-31.787-58.062-65.487c0-33.7,25.403-61.561,58.062-65.487V321.487z M248.082,174.575c-41.411,3.996-73.897,38.984-73.897,81.425s32.486,77.428,73.897,81.425v79.565H15.835v-89.732h73.897v-21.745c23.9-3.808,42.227-24.558,42.227-49.513c0-24.955-18.326-45.705-42.227-49.513v-21.745H15.835V95.01h232.247V174.575z M89.732,289.377v-66.754c15.112,3.585,26.392,17.184,26.392,33.377S104.844,285.792,89.732,289.377z M496.165,311.423h-58.062V200.577h58.062V311.423z M496.165,184.742h-73.897v21.745c-23.9,3.808-42.227,24.558-42.227,49.513c0,24.955,18.326,45.705,42.227,49.513v21.745h73.897v89.732H263.918v-79.565c41.411-3.996,73.897-38.984,73.897-81.425s-32.486-77.428-73.897-81.425V95.01h232.247V184.742z M422.268,222.623v66.754c-15.112-3.585-26.392-17.184-26.392-33.377S407.156,226.208,422.268,222.623z"/></g></g></svg>` },
            { id: 'audio', name: 'Audio', svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2C6.48 2 2 6.48 2 12v5.5C2 19.43 3.57 21 5.5 21H8a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1H4v-1c0-4.41 3.59-8 8-8s8 3.59 8 8v1h-4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2.5c1.93 0 3.5-1.57 3.5-3.5V12c0-5.52-4.48-10-10-10z'/></svg>` },
            { id: 'following', name: 'Following', svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M7 2h10a2 2 0 0 1 2 2v2H5a2 2 0 0 0-2 2v10h2V6a2 2 0 0 1 2-2zm-2 6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H5zm7.5 3a3.5 3.5 0 1 1-2.12 6.27l-1.82 1.82a1 1 0 0 1-1.42-1.42l1.82-1.82A3.5 3.5 0 0 1 12.5 11zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z'/></svg>` }
        ]);

        const getIconStyle = (svgString) => {
            let url = svgString.startsWith('http') ? `url("${svgString}")` : `url("data:image/svg+xml;utf8,${encodeURIComponent(svgString)}")`;
            return { maskImage: url, WebkitMaskImage: url };
        };

// === ГЛОБАЛЬНЫЕ НАСТРОЙКИ СВАЙПА ===
        

        const topStories = ref([
            // СЕКЦИЯ: TOP STORIES
            {
                id: '1', layout: 'hero', sectionTitle: 'Top Stories',
                image: 'https://placehold.co/600x400/e1e4e8/999999?text=Reuters',
                publisher: 'Reuters', title: 'Relief at truce gives way to alarm as Israel pounds Lebanon, Iran hits neighbors',
                time: '1h ago', authors: 'World', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'row-1', layout: 'grid-row',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_GRID, activeSubCardIndex: 0 },
                cards: [
                    { id: '2', image: 'https://placehold.co/300x200/e1e4e8/999999?text=THE+HILL', publisher: 'THE HILL', title: 'Republicans eye new cuts to food stamps, Medicaid', time: '2h ago', authors: 'Politics' },
                    { id: '3', image: 'https://i.iplsc.com/-/000MFL84L9FFU1KQ-C316.webp', publisher: 'AP apnews.com', title: 'Trump meets with European leaders', time: '3h ago', authors: 'News' }
                ]
            },
            {
                id: '4', layout: 'list',
                image: 'https://placehold.co/200x200/e1e4e8/999999?text=npr',
                publisher: 'npr', title: 'ICE acknowledges it is using powerful spyware',
                time: '48m ago', authors: 'Jude Joffe-Block', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: '5', layout: 'list', isAppleNewsPlus: true,
                image: 'https://placehold.co/200x200/e1e4e8/999999?text=Vox',
                publisher: 'Vox', title: 'Ozempic just got cheap enough to change the world',
                time: '1h ago', authors: 'Health', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: '6', layout: 'list', isAppleNewsPlus: true,
                image: 'https://placehold.co/200x200/e1e4e8/999999?text=New+Yorker',
                publisher: 'THE NEW YORKER', title: 'The camps promising to turn men into alphas',
                time: '2h ago', authors: 'Culture', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // СЕКЦИЯ: FOR YOU
            {
                id: '7', layout: 'hero', sectionTitle: 'For You', sectionSubtitle: 'Recommendations based on topics & channels you read.',
                image: 'https://placehold.co/600x400/e1e4e8/999999?text=People',
                publisher: 'People', title: 'Craig Melvin Accidentally Reveals Major Jenna Bush Hager News During Live \'Today\' Show Broadcast: \'My Bad!\'',
                time: '3h ago', authors: 'Entertainment', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'row-2', layout: 'grid-row',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_GRID, activeSubCardIndex: 0 },
                cards: [
                    { id: '8', image: 'https://placehold.co/300x200/e1e4e8/999999?text=NBC+NEWS', publisher: 'NBC NEWS', title: 'See the first close-up photos of the moon from NASA\'s Artemis II mission', time: '1d ago', authors: 'Space' },
                    { id: '9', isAppleNewsPlus: true, image: 'https://placehold.co/300x200/e1e4e8/999999?text=BBC', publisher: 'BBC Science Focus', title: 'These are the 6 worst poops you\'ll ever do, according to a Harvard doctor', time: '2d ago', authors: 'Health' }
                ]
            },
            {
                id: 'row-3', layout: 'grid-row',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_GRID, activeSubCardIndex: 0 },
                cards: [
                    { id: '10', image: 'https://placehold.co/300x200/e1e4e8/999999?text=billboard', publisher: 'billboard', title: 'Karol G Strips Down for Steamy \'Playboy\' Cover & Discusses Making Coachella Histor...', time: '4h ago', authors: 'Music' },
                    { id: '11', image: 'https://placehold.co/300x200/e1e4e8/999999?text=VOGUE', publisher: 'VOGUE', title: 'Kylie and Kendall Jenner Have a Spring It-Shoe-Off', time: '3h ago', authors: 'Fashion' }
                ]
            },

            // СЕКЦИЯ: READER FAVORITES
            {
                id: 'row-4', layout: 'grid-row', sectionTitle: 'Reader Favorites',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_GRID, activeSubCardIndex: 0 },
                cards: [
                    { id: '12', isAppleNewsPlus: true, image: 'https://placehold.co/300x200/e1e4e8/999999?text=VOGUE', publisher: 'VOGUE', title: 'She drank 2.5 liters of water a day. Here\'s how it changed her skin and body.', time: '1d ago', authors: 'Daisy Jones' },
                    { id: '13', isAppleNewsPlus: true, image: 'https://placehold.co/300x200/e1e4e8/999999?text=WSJ', publisher: 'THE WALL STREET JOURNAL', title: 'Retired and moving closer to your adult child? Think again.', time: '1d ago', authors: 'Francine Russo' }
                ]
            },
            {
                id: '14', layout: 'list', isAppleNewsPlus: true,
                image: 'https://placehold.co/200x200/e1e4e8/999999?text=BBC',
                publisher: 'BBC Science Focus', title: 'Exercise isn\'t the key to burning fat. Here\'s what is.',
                time: '2d ago', authors: 'Health', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // СЕКЦИЯ: TRENDING STORIES
            {
                id: '15', layout: 'trending', sectionTitle: 'Trending Stories', isTrendingSection: true, rank: 1,
                publisher: 'HUFFPOST', title: 'This Beloved Beverage Is Being Linked To Colorectal Cancer. Here\'s What Doctors Want You To Know.',
                time: '2h ago', authors: 'Julia Ries Wexler', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: '16', layout: 'trending', rank: 2,
                publisher: 'BuzzFeed', title: '27 Photos From The \'60s That Will Make You Gasp At How Unrecognizable Life Used To Be',
                time: '4h ago', authors: 'Jenna Guillaume', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: '17', layout: 'trending', rank: 3,
                publisher: 'POPULAR MECHANICS', title: 'A Ship Saved Thousands of Lives Before Vanishing in the Dark. 77 Yea...',
                time: '5h ago', authors: 'History', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: '18', layout: 'trending', rank: 4, isAppleNewsPlus: true,
                publisher: 'People', title: 'Man with Chromosome Abnormality Hands Out Surprise Gift to Every Passenger on His Flight, with a Very...',
                time: '23h ago', authors: 'Ashley Vega', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // СЕКЦИЯ: ENTERTAINMENT
            {
                id: '19', layout: 'hero', sectionTitle: 'Entertainment', sectionSubtitle: 'Love Entertainment? Tap + to follow.', 
                image: 'https://placehold.co/600x400/e1e4e8/999999?text=Hulk+Hogan',
                publisher: 'E NEWS', title: "Hulk Hogan's Eerie Words in Final Interview...",
                time: '12h ago', authors: 'Entertainment', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'row-5', layout: 'grid-row',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_GRID, activeSubCardIndex: 0 },
                cards: [
                    { id: '20', image: 'https://placehold.co/300x200/e1e4e8/999999?text=Actors', publisher: 'Entertainment', title: '7 actors who lost out on roles for seriously bizarre reasons', time: '1d ago', authors: 'Movies' },
                    { id: '21', image: 'https://placehold.co/300x200/e1e4e8/999999?text=Mormon+Wives', publisher: 'E NEWS', title: "Mormon Wives' Jessi Draper Details Plans for Therapy Retreat Amid Jordan Ng...", time: '38m ago', authors: 'TV' }
                ]
            },

            // СЕКЦИЯ: HEALTH & WELLNESS
            {
                id: '22', layout: 'hero', sectionTitle: 'Health & Wellness', sectionSubtitle: 'Love Health & Wellness? Tap + to follow.', 
                image: 'https://placehold.co/600x400/e1e4e8/999999?text=Yoga+Class',
                publisher: 'Health', title: 'Outdoor group workouts are taking over the parks this spring',
                time: '4h ago', authors: 'Fitness', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            }
        ]);

        const updateDate = () => {
            const now = new Date();
            const options = { month: 'long', day: 'numeric' };
            currentDate.value = now.toLocaleDateString('en-US', options);
        };

        onMounted(() => { updateDate(); });

        // === ОБНОВЛЕННАЯ ЛОГИКА АНИМАЦИИ (Точь-в-точь как на скринах) ===
        // === ФИНАЛЬНАЯ ЛОГИКА АНИМАЦИИ В СЕТКЕ ===
        // === УМНЫЕ ГРАНИЦЫ ДЛЯ АСИММЕТРИЧНОГО СВАЙПА ===
        const getSwipeBounds = (card) => {
            const state = card.swipeState;
            let maxRight = state.maxOffset; 
            let maxLeft = -state.maxOffset;

            if (card.layout === 'grid-row') {
                const screenWidth = window.innerWidth;
                const containerWidth = screenWidth - 40; 
                const cardWidth = (containerWidth - 16) / 2; 
                const fullSwapOffset = cardWidth + 16; 

                if (state.activeSubCardIndex === 0) {
                    // ЛЕВАЯ КАРТОЧКА
                    maxRight = fullSwapOffset;  // Вправо: едет до конца (на место правой)
                    maxLeft = -state.maxOffset; // Влево: открывается на 140px и ЗАЦЕПЛЯЕТСЯ
                } else {
                    // ПРАВАЯ КАРТОЧКА
                    maxRight = state.maxOffset; // Вправо: открывается на 140px и ЗАЦЕПЛЯЕТСЯ
                    maxLeft = -fullSwapOffset;  // Влево: едет до конца (на место левой)
                }
            }
            return { maxRight, maxLeft };
        };

        const getGridCardStyle = (news, index) => {
            const state = news.swipeState;
            const offsetX = state.offsetX;
            const activeIdx = state.activeSubCardIndex;

            if (!state.isSwiping && offsetX === 0) {
                return { transform: 'translateX(0px)', opacity: 1, zIndex: 1, pointerEvents: 'auto' };
            }

            // АКТИВНАЯ карточка
            if (index === activeIdx) {
                return { transform: `translateX(${offsetX}px)`, opacity: 1, zIndex: 2, pointerEvents: 'auto' };
            }

            // НЕАКТИВНАЯ карточка (соседняя)
         const bounds = getSwipeBounds(news);
            // maxTravel автоматически подтянет 100 (или расчет с учетом 100) из getSwipeBounds
            const maxTravel = offsetX > 0 ? bounds.maxRight : Math.abs(bounds.maxLeft);
            const progress = Math.min(Math.abs(offsetX) / (maxTravel * 0.8), 1); 
            const opacity = 1 - progress;

            let neighborOffsetX = 0;
            if (activeIdx === 0 && offsetX > 0) {
                neighborOffsetX = offsetX * 0.5; // Параллакс вправо
            } else if (activeIdx === 1 && offsetX < 0) {
                neighborOffsetX = offsetX * 0.5; // Параллакс влево
            }

            return {
                transform: `translateX(${neighborOffsetX}px)`, 
                opacity,
                zIndex: 1, 
                pointerEvents: 'none' 
            };
        };

       // === ЛОГИКА ОТОБРАЖЕНИЯ И АНИМАЦИИ КНОПОК ===
       // === ЛОГИКА ОТОБРАЖЕНИЯ И АНИМАЦИИ КНОПОК ===
        const getButtonStyle = (news, side, index) => {
            const state = news.swipeState;
            const offsetX = state.offsetX;
            let opacity = 0;
            
            if (side === 'left' && offsetX > 0) opacity = 1;
            else if (side === 'right' && offsetX < 0) opacity = 1;

            const bounds = getSwipeBounds(news);
            const currentMax = side === 'left' ? bounds.maxRight : Math.abs(bounds.maxLeft);
            const currentSwipeDistance = Math.abs(offsetX);

            const BASE_SCALE = 0.9;
            const MAX_ADD = 0.1; 
            let scale = BASE_SCALE;
            
            if (opacity === 1) {
                const startReveal = (index === 0) ? 0 : (currentMax * 0.3);
                const endReveal = (index === 0) ? (currentMax * 0.6) : currentMax;
                
                if (currentSwipeDistance >= startReveal) {
                    let progress = (currentSwipeDistance - startReveal) / (endReveal - startReveal);
                    progress = Math.min(progress, 1);
                    scale = BASE_SCALE + (progress * MAX_ADD);
                }
                
                // === НОВОЕ: ВИЗУАЛ ПРИ СИЛЬНОМ ПЕРЕТЯГИВАНИИ ===
                const overswipeThreshold = currentMax + 30; // Порог: проехали на 30px дальше максимума
                
                if (currentSwipeDistance > overswipeThreshold) {
                    if (index === 0) {
                        // Крайняя кнопка (Дизлайк или Сохранить) увеличивается, показывая готовность
                        scale = 1.15;
                    } else {
                        // Внутренняя кнопка (Лайк или Шер) плавно исчезает
                        scale = 0.5;
                        opacity = 0; 
                    }
                } 
                // Стандартный легкий overscroll для второй кнопки
                else if (currentSwipeDistance > currentMax && index === 1) {
                     const overscroll = (currentSwipeDistance - currentMax) / 50;
                     scale += overscroll * 0.05; 
                }
            }
            
            return {
                transform: `scale(${scale})`,
                opacity: opacity,
                // Делаем анимацию чуть быстрее при перетягивании, чтобы она реагировала мгновенно
                transition: currentSwipeDistance > currentMax ? 'all 0.2s ease' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)'
            };
        };

        const handleSwipeStart = (event, cardId) => {
            // 1. ЗАЩИТА ОТ МУЛЬТИТАЧА: 
            // Если мы уже тянем какую-то карточку, игнорируем любые новые касания экрана!
            if (activeSwipeCard) return;

            const card = topStories.value.find(s => s.id === cardId);
            if (!card) return;

            // 2. ЛОГИКА ДЛЯ СЕТКИ И СОСЕДНЕЙ КАРТОЧКИ
            if (card.layout === 'grid-row') {
                const rect = event.currentTarget.getBoundingClientRect();
                const clientX = event.touches ? event.touches[0].clientX : event.clientX;
                const isLeft = (clientX - rect.left) < (rect.width / 2);
                const touchedIndex = isLeft ? 0 : 1;

                // Если ряд УЖЕ открыт, и мы трогаем НЕАКТИВНУЮ (исчезнувшую) половину:
                if (card.swipeState.offsetX !== 0 && card.swipeState.activeSubCardIndex !== touchedIndex) {
                    // Просто закрываем открытую карточку и блокируем новый свайп
                    card.swipeState.offsetX = 0; 
                    return; 
                }

                // Устанавливаем, какую именно половину мы сейчас тянем
                card.swipeState.activeSubCardIndex = touchedIndex;
            }

            activeSwipeCard = card;

            activeSwipeCard.swipeState.startX = event.touches ? event.touches[0].clientX : event.clientX;
            activeSwipeCard.swipeState.startY = event.touches ? event.touches[0].clientY : event.clientY;
            activeSwipeCard.swipeState.startOffsetX = activeSwipeCard.swipeState.offsetX; 
            activeSwipeCard.swipeState.isSwiping = true;
            activeSwipeCard.swipeState.isDragging = false; 

            if (event.type === 'mousedown') {
                document.addEventListener('mousemove', handleSwipeMove);
                document.addEventListener('mouseup', handleSwipeEnd);
            } else {
                document.addEventListener('touchmove', handleSwipeMove, { passive: false });
                document.addEventListener('touchend', handleSwipeEnd);
            }
        };

        const handleSwipeMove = (event) => {
            if (!activeSwipeCard || !activeSwipeCard.swipeState.isSwiping) return;
            const state = activeSwipeCard.swipeState;
            const currentX = event.touches ? event.touches[0].clientX : event.clientX;
            const currentY = event.touches ? event.touches[0].clientY : event.clientY;
            let deltaX = currentX - state.startX;
            let deltaY = currentY - state.startY;

            if (!state.isDragging) {
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 5) {
                    state.isDragging = true;
                    state.startX = currentX; 
                    deltaX = 0; 
                } else if (Math.abs(deltaY) > 5) {
                    handleSwipeEnd();
                    return;
                } else { return; }
            }

            if (event.cancelable && state.isDragging) event.preventDefault();
            
            const bounds = getSwipeBounds(activeSwipeCard);
            let newOffsetX = state.startOffsetX + deltaX;

            // Применяем "резинку" в зависимости от новых расчетных границ
            if (newOffsetX > bounds.maxRight) {
                newOffsetX = bounds.maxRight + (newOffsetX - bounds.maxRight) * 0.25;
            } else if (newOffsetX < bounds.maxLeft) {
                newOffsetX = bounds.maxLeft + (newOffsetX - bounds.maxLeft) * 0.25;
            }
            state.offsetX = newOffsetX;
        };

        const handleSwipeEnd = () => {
            if (!activeSwipeCard) return;
            const state = activeSwipeCard.swipeState;
            
            if (!state.isDragging) {
                if (state.startOffsetX !== 0) {
                    state.offsetX = 0;
                } else {
                    state.offsetX = 0; 
                }
            } else {
                const bounds = getSwipeBounds(activeSwipeCard);
                const thresholdRight = bounds.maxRight * 0.4;
                const thresholdLeft = bounds.maxLeft * 0.4;
                
                // === НОВОЕ: ПОРОГИ СРАБАТЫВАНИЯ АВТО-ДЕЙСТВИЯ ===
                const triggerRight = bounds.maxRight + 30; // Потянули далеко вправо
                const triggerLeft = bounds.maxLeft - 30;   // Потянули далеко влево

                // Если отпустили палец в зоне перетягивания:
                if (state.offsetX > triggerRight) { 
                    onDislike(activeSwipeCard.id); // Вызываем 디злайк
                    state.offsetX = 0;             // И сразу закрываем карточку
                } 
                else if (state.offsetX < triggerLeft) { 
                    onSave(activeSwipeCard.id);    // Вызываем сохранение
                    state.offsetX = 0;             // И сразу закрываем карточку
                } 
                // Стандартное поведение (просто открыть меню)
                else if (state.offsetX > thresholdRight) { 
                    state.offsetX = bounds.maxRight; 
                } 
                else if (state.offsetX < thresholdLeft) { 
                    state.offsetX = bounds.maxLeft;  
                } 
                else { 
                    state.offsetX = 0; 
                }
            }
            
            state.isSwiping = false;
            state.isDragging = false; 

            document.removeEventListener('mousemove', handleSwipeMove);
            document.removeEventListener('mouseup', handleSwipeEnd);
            document.removeEventListener('touchmove', handleSwipeMove);
            document.removeEventListener('touchend', handleSwipeEnd);
            activeSwipeCard = null;
        };

        const onLike = (id) => { resetSwipe(id); };
        const onDislike = (id) => { resetSwipe(id); };
        const onSave = (id) => { resetSwipe(id); };
        const onShare = (id) => { resetSwipe(id); };
        const resetSwipe = (id) => {
            const card = topStories.value.find(s => s.id === id);
            if (card) { card.swipeState.offsetX = 0; }
        };


       return {
            currentDate, currentTab, tabs, topStories, getIconStyle, getButtonStyle, getGridCardStyle,
            handleSwipeStart, onLike, onDislike, onSave, onShare
        };
    }
}).mount('#app');