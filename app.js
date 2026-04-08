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

        // ПОЛНАЯ ЛЕНТА ИЗ СКРИНШОТОВ С РАЗНЫМИ ЛЕЙАУТАМИ
        const topStories = ref([
            // СЕКЦИЯ: TOP STORIES
            {
                id: 1, layout: 'hero', sectionTitle: 'Top Stories',
                image: 'https://placehold.co/600x400/e1e4e8/999999?text=Reuters',
                publisher: 'Reuters', title: 'Relief at truce gives way to alarm as Israel pounds Lebanon, Iran hits neighbors',
                time: '1h ago', authors: 'World', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 140 }
            },
            {
                id: 2, layout: 'grid-half',
                image: 'https://placehold.co/300x200/e1e4e8/999999?text=THE+HILL',
                publisher: 'THE HILL', title: 'Republicans eye new cuts to food stamps, Medicaid',
                time: '2h ago', authors: 'Politics', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 80 } // Уменьшен свайп для маленьких карточек
            },
            {
                id: 3, layout: 'grid-half',
                image: 'https://placehold.co/300x200/e1e4e8/999999?text=AP',
                publisher: 'AP apnews.com', title: 'Trump meets with European leaders',
                time: '3h ago', authors: 'News', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 80 }
            },
            {
                id: 4, layout: 'list',
                image: 'https://placehold.co/200x200/e1e4e8/999999?text=npr',
                publisher: 'npr', title: 'ICE acknowledges it is using powerful spyware',
                time: '48m ago', authors: 'Jude Joffe-Block', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 140 }
            },
            {
                id: 5, layout: 'list', isAppleNewsPlus: true,
                image: 'https://placehold.co/200x200/e1e4e8/999999?text=Vox',
                publisher: 'Vox', title: 'Ozempic just got cheap enough to change the world',
                time: '1h ago', authors: 'Health', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 140 }
            },
            {
                id: 6, layout: 'list', isAppleNewsPlus: true,
                image: 'https://placehold.co/200x200/e1e4e8/999999?text=New+Yorker',
                publisher: 'THE NEW YORKER', title: 'The camps promising to turn men into alphas',
                time: '2h ago', authors: 'Culture', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 140 }
            },

            // СЕКЦИЯ: FOR YOU
            {
                id: 7, layout: 'hero', sectionTitle: 'For You', sectionSubtitle: 'Recommendations based on topics & channels you read.',
                image: 'https://placehold.co/600x400/e1e4e8/999999?text=People',
                publisher: 'People', title: 'Craig Melvin Accidentally Reveals Major Jenna Bush Hager News During Live \'Today\' Show Broadcast: \'My Bad!\'',
                time: '3h ago', authors: 'Entertainment', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 140 }
            },
            {
                id: 8, layout: 'grid-half',
                image: 'https://placehold.co/300x200/e1e4e8/999999?text=NBC+NEWS',
                publisher: 'NBC NEWS', title: 'See the first close-up photos of the moon from NASA\'s Artemis II mission',
                time: '1d ago', authors: 'Space', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 80 }
            },
            {
                id: 9, layout: 'grid-half', isAppleNewsPlus: true,
                image: 'https://placehold.co/300x200/e1e4e8/999999?text=BBC',
                publisher: 'BBC Science Focus', title: 'These are the 6 worst poops you\'ll ever do, according to a Harvard doctor',
                time: '2d ago', authors: 'Health', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 80 }
            },
            {
                id: 10, layout: 'grid-half',
                image: 'https://placehold.co/300x200/e1e4e8/999999?text=billboard',
                publisher: 'billboard', title: 'Karol G Strips Down for Steamy \'Playboy\' Cover & Discusses Making Coachella Histor...',
                time: '4h ago', authors: 'Music', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 80 }
            },
            {
                id: 11, layout: 'grid-half',
                image: 'https://placehold.co/300x200/e1e4e8/999999?text=VOGUE',
                publisher: 'VOGUE', title: 'Kylie and Kendall Jenner Have a Spring It-Shoe-Off',
                time: '3h ago', authors: 'Fashion', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 80 }
            },

            // СЕКЦИЯ: READER FAVORITES
            {
                id: 12, layout: 'grid-half', sectionTitle: 'Reader Favorites', isAppleNewsPlus: true,
                image: 'https://placehold.co/300x200/e1e4e8/999999?text=VOGUE',
                publisher: 'VOGUE', title: 'She drank 2.5 liters of water a day. Here\'s how it changed her skin and body.',
                time: '1d ago', authors: 'Daisy Jones', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 80 }
            },
            {
                id: 13, layout: 'grid-half', isAppleNewsPlus: true,
                image: 'https://placehold.co/300x200/e1e4e8/999999?text=WSJ',
                publisher: 'THE WALL STREET JOURNAL', title: 'Retired and moving closer to your adult child? Think again.',
                time: '1d ago', authors: 'Francine Russo', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 80 }
            },
            {
                id: 14, layout: 'list', isAppleNewsPlus: true,
                image: 'https://placehold.co/200x200/e1e4e8/999999?text=BBC',
                publisher: 'BBC Science Focus', title: 'Exercise isn\'t the key to burning fat. Here\'s what is.',
                time: '2d ago', authors: 'Health', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 140 }
            },

            // СЕКЦИЯ: TRENDING STORIES (Без картинок, с цифрами)
            {
                id: 15, layout: 'trending', sectionTitle: 'Trending Stories', isTrendingSection: true, rank: 1,
                publisher: 'HUFFPOST', title: 'This Beloved Beverage Is Being Linked To Colorectal Cancer. Here\'s What Doctors Want You To Know.',
                time: '2h ago', authors: 'Julia Ries Wexler', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 140 }
            },
            {
                id: 16, layout: 'trending', rank: 2,
                publisher: 'BuzzFeed', title: '27 Photos From The \'60s That Will Make You Gasp At How Unrecognizable Life Used To Be',
                time: '4h ago', authors: 'Jenna Guillaume', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 140 }
            },
            {
                id: 17, layout: 'trending', rank: 3,
                publisher: 'POPULAR MECHANICS', title: 'A Ship Saved Thousands of Lives Before Vanishing in the Dark. 77 Yea...',
                time: '5h ago', authors: 'History', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 140 }
            },
            {
                id: 18, layout: 'trending', rank: 4, isAppleNewsPlus: true,
                publisher: 'People', title: 'Man with Chromosome Abnormality Hands Out Surprise Gift to Every Passenger on His Flight, with a Very...',
                time: '23h ago', authors: 'Ashley Vega', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: 140 }
            }
        ]);

        const updateDate = () => {
            const now = new Date();
            const options = { month: 'long', day: 'numeric' };
            currentDate.value = now.toLocaleDateString('en-US', options);
        };

        onMounted(() => { updateDate(); });

        const getButtonScale = (news, side, index) => {
            const offsetX = news.swipeState.offsetX;
            const maxOffset = news.swipeState.maxOffset;
            const BASE_SCALE = 0.9;
            const MAX_ADD = 0.1; 
            if (side === 'left' && offsetX <= 0) return BASE_SCALE;
            if (side === 'right' && offsetX >= 0) return BASE_SCALE;
            const currentSwipeDistance = Math.abs(offsetX);
            const startReveal = (index === 0) ? 0 : (maxOffset * 0.3);
            const endReveal = (index === 0) ? (maxOffset * 0.6) : maxOffset;
            if (currentSwipeDistance < startReveal) return BASE_SCALE;
            let progress = (currentSwipeDistance - startReveal) / (endReveal - startReveal);
            progress = Math.min(progress, 1);
            let scale = BASE_SCALE + (progress * MAX_ADD);
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