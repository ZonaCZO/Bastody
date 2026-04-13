const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const currentDate = ref('');
        const currentTab = ref('today');
        const SWIPE_OFFSET_NORMAL = 170; 
        const SWIPE_OFFSET_GRID = 100;   
        let activeSwipeCard = null;

        const tabs = ref([
            { id: 'today', name: 'Today', svg: `https://noxit.io/wp-content/uploads/2023/02/logo.svg` },
            { id: 'news', name: 'News+', svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M6 2h7.5L19 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 2v4h4L13 4z'/></svg>` },
            { id: 'audio', name: 'Audio', svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2C6.48 2 2 6.48 2 12v5.5C2 19.43 3.57 21 5.5 21H8a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1H4v-1c0-4.41 3.59-8 8-8s8 3.59 8 8v1h-4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2.5c1.93 0 3.5-1.57 3.5-3.5V12c0-5.52-4.48-10-10-10z'/></svg>` },
            { id: 'following', name: 'Following', svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M7 2h10a2 2 0 0 1 2 2v2H5a2 2 0 0 0-2 2v10h2V6a2 2 0 0 1 2-2zm-2 6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H5zm7.5 3a3.5 3.5 0 1 1-2.12 6.27l-1.82 1.82a1 1 0 0 1-1.42-1.42l1.82-1.82A3.5 3.5 0 0 1 12.5 11zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z'/></svg>` }
        ]);

        const topics = ref([
            { name: 'Sports', icon: '⚽️' },
            { name: 'Puzzles', icon: '🧩' },
            { name: 'Local', icon: '📍' },
            { name: 'Entertainment', icon: '🍿' },
            { name: 'Technology', icon: '💻' }
        ]);

        const getIconStyle = (svgString) => {
            let url = svgString.startsWith('http') ? `url("${svgString}")` : `url("data:image/svg+xml;utf8,${encodeURIComponent(svgString)}")`;
            return { maskImage: url, WebkitMaskImage: url };
        };

        const topStories = ref([
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
                image: 'https://placehold.co/200x200/e1e4e8/999999?text=CeraVe',
                // Цветной логотип REAL SIMPLE!
                publisher: '<span style="color: #FF2D55;">REAL</span>SIMPLE', title: "CeraVe's $15 Anti-Aging 'Wonder Cream' on Amazon Banishes Under-Eye Bags",
                time: '8h ago', authors: 'Miles Walls', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
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
            {
                id: 'row-4', layout: 'grid-row', sectionTitle: 'Reader Favorites',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_GRID, activeSubCardIndex: 0 },
                cards: [
                    // Цветной логотип FOOD&WINE
                    { id: '12', image: 'https://placehold.co/300x200/e1e4e8/999999?text=Food', publisher: '<strong>FOOD</strong>&<strong>WINE</strong>', title: 'Stop Tossing Mushy Bananas — Shoppers Found a Solution', time: '6h ago', authors: 'Grace Cooper' },
                    { id: '13', isAppleNewsPlus: true, image: 'https://placehold.co/300x200/e1e4e8/999999?text=WSJ', publisher: 'THE WALL STREET JOURNAL', title: 'Retired and moving closer to your adult child? Think again.', time: '1d ago', authors: 'Francine Russo' }
                ]
            },
            {
                id: '15', layout: 'trending', sectionTitle: 'Trending Stories', isTrendingSection: true, rank: 1,
                publisher: '<span style="color: red; font-style: italic;">autoblog</span>', title: 'Subaru Ditched the Wagon and Outback Sales Dropped Over 40%',
                time: '23h ago', authors: 'Marnus Moolman', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: '16', layout: 'trending', rank: 2,
                publisher: 'The Guardian', title: "The pet I'll never forget: Chilly, the kitten I saved from freezing to death",
                time: '3h ago', authors: 'News', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: '17', layout: 'trending', rank: 3,
                publisher: '<span style="color: #FF2D55;">Newsweek</span>', title: '"My husband died at 30 from colon cancer. This one symptom was shockingly common"',
                time: '5h ago', authors: 'Health', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: '19', layout: 'hero', sectionTitle: 'Travel', sectionSubtitle: 'Love Travel? Tap + to follow.', 
                image: 'https://placehold.co/600x400/e1e4e8/999999?text=Greece',
                publisher: 'AFAR', title: "Greece's New Hiking Trail Network Passes Ancient Ruins",
                time: '16m ago', authors: 'Helen Iatrou', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // СЕКЦИЯ: LATEST PUZZLES
            {
                id: '200', layout: 'hero', sectionTitle: 'Latest Puzzles',
                image: 'https://placehold.co/600x600/8B5CF6/FFFFFF?text=Crossword',
                publisher: 'Crossword', title: 'Monday, Apr 13\nHybrid Animals',
                time: 'Easy', authors: 'Claire Rimkus', isAppleNewsPlus: true, swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: '201', layout: 'list',
                image: 'https://placehold.co/200x200/FFCC00/000000?text=Emoji+Game',
                publisher: 'Emoji Game', title: 'Monday, Apr 13',
                time: 'Play Now', authors: 'Games', isAppleNewsPlus: true, swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // СЕКЦИЯ: FOOD (Spring Pastas)
            {
                id: 'row-food', layout: 'grid-row', sectionTitle: 'Spring Pastas', sectionSubtitle: 'Selected by the Apple News editors.',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_GRID, activeSubCardIndex: 0 },
                cards: [
                    { id: '202', isAppleNewsPlus: true, image: 'https://placehold.co/300x350/e1e4e8/999999?text=Penne+Skillet', publisher: 'EatingWell', title: 'Marry-Me Chicken-and-Spinach Penne Skillet', time: '35m', authors: 'Recipe' },
                    { id: '203', isAppleNewsPlus: true, image: 'https://placehold.co/300x350/e1e4e8/999999?text=Pasta+Salad', publisher: '<strong>FOOD</strong>&<strong>WINE</strong>', title: 'Caprese-Pesto Pasta Salad', time: '20m', authors: 'Recipe' }
                ]
            },
        ]);

        const updateDate = () => {
            const now = new Date();
            const options = { month: 'long', day: 'numeric' };
            currentDate.value = now.toLocaleDateString('en-US', options);
        };

        onMounted(() => { updateDate(); });

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
                    maxRight = fullSwapOffset;  
                    maxLeft = -state.maxOffset; 
                } else {
                    maxRight = state.maxOffset; 
                    maxLeft = -fullSwapOffset;  
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

            if (index === activeIdx) {
                return { transform: `translateX(${offsetX}px)`, opacity: 1, zIndex: 2, pointerEvents: 'auto' };
            }

            const bounds = getSwipeBounds(news);
            const maxTravel = offsetX > 0 ? bounds.maxRight : Math.abs(bounds.maxLeft);
            const progress = Math.min(Math.abs(offsetX) / (maxTravel * 0.8), 1); 
            const opacity = 1 - progress;

            let neighborOffsetX = 0;
            if (activeIdx === 0 && offsetX > 0) {
                neighborOffsetX = offsetX * 0.5; 
            } else if (activeIdx === 1 && offsetX < 0) {
                neighborOffsetX = offsetX * 0.5; 
            }

            return {
                transform: `translateX(${neighborOffsetX}px)`, 
                opacity,
                zIndex: 1, 
                pointerEvents: 'none' 
            };
        };

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
                
                const overswipeThreshold = currentMax + 30; 
                
                if (currentSwipeDistance > overswipeThreshold) {
                    if (index === 0) {
                        scale = 1.15;
                    } else {
                        scale = 0.5;
                        opacity = 0; 
                    }
                } 
                else if (currentSwipeDistance > currentMax && index === 1) {
                     const overscroll = (currentSwipeDistance - currentMax) / 50;
                     scale += overscroll * 0.05; 
                }
            }
            
            return {
                transform: `scale(${scale})`,
                opacity: opacity,
                transition: currentSwipeDistance > currentMax ? 'all 0.2s ease' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)'
            };
        };

        const handleSwipeStart = (event, cardId) => {
            if (activeSwipeCard) return;

            const card = topStories.value.find(s => s.id === cardId);
            if (!card) return;

            if (card.layout === 'grid-row') {
                const rect = event.currentTarget.getBoundingClientRect();
                const clientX = event.touches ? event.touches[0].clientX : event.clientX;
                const isLeft = (clientX - rect.left) < (rect.width / 2);
                const touchedIndex = isLeft ? 0 : 1;

                if (card.swipeState.offsetX !== 0 && card.swipeState.activeSubCardIndex !== touchedIndex) {
                    card.swipeState.offsetX = 0; 
                    return; 
                }

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
                
                const triggerRight = bounds.maxRight + 30; 
                const triggerLeft = bounds.maxLeft - 30;   

                if (state.offsetX > triggerRight) { 
                    onDislike(activeSwipeCard.id); 
                    state.offsetX = 0;             
                } 
                else if (state.offsetX < triggerLeft) { 
                    onSave(activeSwipeCard.id);    
                    state.offsetX = 0;             
                } 
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
            currentDate, currentTab, tabs, topics, topStories, getIconStyle, getButtonStyle, getGridCardStyle,
            handleSwipeStart, onLike, onDislike, onSave, onShare
        };
    }
}).mount('#app');