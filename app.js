const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const currentDate = ref('');
        const currentTab = ref('today');
        let activeSwipeCard = null;

        const tabs = ref([
            { id: 'today', name: 'Today', iconShape: 'rect' },
            { id: 'news', name: 'News+', iconShape: 'rect' },
            { id: 'sports', name: 'Sports', iconShape: 'rect' },
            { id: 'audio', name: 'Audio', iconShape: 'circle' },
            { id: 'following', name: 'Following', iconShape: 'circle' }
        ]);

        const topStories = ref([
            {
                id: 1,
                image1: 'https://placehold.co/200x200/cccccc/ffffff?text=Image+1',
                image2: 'https://placehold.co/200x200/bbbbbb/ffffff?text=Image+2',
                publisher: 'NBC NEWS',
                title: 'One pilot rescued, one missing after U.S. fighter jet shot down in Iran',
                time: '2h ago',
                authors: 'Courtney Kube, Mosheh Gains, Pat...',
                // Добавили startOffsetX для запоминания позиции перед новым свайпом
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 140 }
            }
        ]);

        const updateDate = () => {
            const now = new Date();
            const options = { month: 'long', day: 'numeric' };
            currentDate.value = now.toLocaleDateString('en-US', options);
        };

        onMounted(() => { updateDate(); });

        const handleSwipeStart = (event, cardId) => {
            const card = topStories.value.find(s => s.id === cardId);
            if (!card) return;

            activeSwipeCard = card;
            const state = activeSwipeCard.swipeState;

            // Запоминаем, где был палец
            state.startX = event.touches ? event.touches[0].clientX : event.clientX;
            state.startY = event.touches ? event.touches[0].clientY : event.clientY;
            
            // ВАЖНО: Запоминаем, где находилась КАРТОЧКА в момент касания
            state.startOffsetX = state.offsetX; 
            
            state.isSwiping = true;
            state.isDragging = false; 

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

            // Проверка порога в 5px, чтобы отличить тап/скролл от свайпа
            if (!state.isDragging) {
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 5) {
                    state.isDragging = true;
                    // Компенсируем "мертвую зону" в 5px, чтобы карточка не прыгнула, когда порог пройден
                    state.startX = currentX; 
                    deltaX = 0; 
                } 
                else if (Math.abs(deltaY) > 5) {
                    handleSwipeEnd();
                    return;
                } 
                else {
                    return;
                }
            }

            if (event.cancelable && state.isDragging) event.preventDefault();

            // ВАЖНО: Прибавляем движение пальца к ИСХОДНОЙ позиции карточки
            let newOffsetX = state.startOffsetX + deltaX;

            // Эффект резинки применяем к новой координате
            if (newOffsetX > state.maxOffset) {
                newOffsetX = state.maxOffset + (newOffsetX - state.maxOffset) * 0.25;
            } else if (newOffsetX < -state.maxOffset) {
                newOffsetX = -state.maxOffset + (newOffsetX + state.maxOffset) * 0.25;
            }

            state.offsetX = newOffsetX;
        };

        const handleSwipeEnd = () => {
            if (!activeSwipeCard) return;

            const state = activeSwipeCard.swipeState;
            state.isSwiping = false;
            state.isDragging = false; 

            // Если протянули больше 40% от максимума в любую сторону - закрепляем
            const threshold = state.maxOffset * 0.4;
            
            if (state.offsetX > threshold) {
                state.offsetX = state.maxOffset;
            } else if (state.offsetX < -threshold) {
                state.offsetX = -state.maxOffset;
            } else {
                state.offsetX = 0;
            }

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

        const getIconStyle = (shape) => {
            const svg = shape === 'rect' 
                ? `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' rx='4' fill='black'/></svg>`
                : `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='black'/></svg>`;
            const url = `url("data:image/svg+xml;utf8,${svg}")`;
            return { maskImage: url, WebkitMaskImage: url };
        };

        return {
            currentDate, currentTab, tabs, topStories, getIconStyle,
            handleSwipeStart, onLike, onDislike, onSave, onShare
        };
    }
}).mount('#app');