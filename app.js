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
                // maxOffset теперь 130px (под размер двух круглых кнопок с отступами)
                swipeState: { startX: 0, offsetX: 0, isSwiping: false, maxOffset: 130 }
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
            activeSwipeCard.swipeState.startX = event.touches ? event.touches[0].clientX : event.clientX;
            activeSwipeCard.swipeState.isSwiping = true;

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
            if (event.cancelable) event.preventDefault(); // Блокируем скролл страницы

            const state = activeSwipeCard.swipeState;
            const currentX = event.touches ? event.touches[0].clientX : event.clientX;
            let deltaX = currentX - state.startX;

            // Добавляем эффект "резинки", если тянем дальше максимума
            if (deltaX > state.maxOffset) {
                deltaX = state.maxOffset + (deltaX - state.maxOffset) * 0.25;
            } else if (deltaX < -state.maxOffset) {
                deltaX = -state.maxOffset + (deltaX + state.maxOffset) * 0.25;
            }

            state.offsetX = deltaX;
        };

        const handleSwipeEnd = () => {
            if (!activeSwipeCard) return;

            const state = activeSwipeCard.swipeState;
            state.isSwiping = false; // Возвращаем CSS-анимацию

            // Если протянули больше 40% - закрепляем, иначе возвращаем обратно
            const threshold = state.maxOffset * 0.4;
            
            if (state.offsetX > threshold) {
                state.offsetX = state.maxOffset; // Прилипает вправо
            } else if (state.offsetX < -threshold) {
                state.offsetX = -state.maxOffset; // Прилипает влево
            } else {
                state.offsetX = 0; // Возвращается в центр
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