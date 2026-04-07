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
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 140 }
            }
        ]);

        const updateDate = () => {
            const now = new Date();
            const options = { month: 'long', day: 'numeric' };
            currentDate.value = now.toLocaleDateString('en-US', options);
        };

        onMounted(() => { updateDate(); });

        // === ОБНОВЛЕННАЯ ЛОГИКА МАСШТАБА ===
        const getButtonScale = (news, side, index) => {
            const offsetX = news.swipeState.offsetX;
            const maxOffset = news.swipeState.maxOffset;
            
            // Базовый размер 90%. Максимальная прибавка 10% (0.1)
            const BASE_SCALE = 0.7;
            const MAX_ADD = 0.3; 
            
            if (side === 'left' && offsetX <= 0) return BASE_SCALE;
            if (side === 'right' && offsetX >= 0) return BASE_SCALE;
            
            const currentSwipeDistance = Math.abs(offsetX);
            
            // Первая кнопка (0) начинает расти сразу. Вторая (1) начинает, когда свайпнули на 30%
            const startReveal = (index === 0) ? 0 : (maxOffset * 0.3);
            const endReveal = (index === 0) ? (maxOffset * 0.6) : maxOffset;
            
            if (currentSwipeDistance < startReveal) return BASE_SCALE;
            
            let progress = (currentSwipeDistance - startReveal) / (endReveal - startReveal);
            progress = Math.min(progress, 1);
            
            let scale = BASE_SCALE + (progress * MAX_ADD);

            // Резиновый эффект перетягивания: добавляем еще чуть-чуть к размеру последней кнопки
            if (currentSwipeDistance > maxOffset && index === 1) {
                 const overscroll = (currentSwipeDistance - maxOffset) / 50;
                 scale += overscroll * 0.05; 
            }

            return scale;
        };

        const handleSwipeStart = (event, cardId) => {
            const card = topStories.value.find(s => s.id === cardId);
            if (!card) return;
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
            let newOffsetX = state.startOffsetX + deltaX;

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
            const threshold = state.maxOffset * 0.4;
            if (state.offsetX > threshold) { state.offsetX = state.maxOffset; } 
            else if (state.offsetX < -threshold) { state.offsetX = -state.maxOffset; } 
            else { state.offsetX = 0; }
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
            currentDate, currentTab, tabs, topStories, getIconStyle, getButtonScale,
            handleSwipeStart, onLike, onDislike, onSave, onShare
        };
    }
}).mount('#app');