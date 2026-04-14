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
            // 1. Hero: Iran (The New York Times)
            {
                id: '1', layout: 'hero', sectionTitle: 'Top Stories',
                image: 'https://static01.nyt.com/images/2026/04/13/multimedia/13int-iran-global-pbkf/13int-iran-global-pbkf-superJumbo.jpg?quality=75&auto=webp',
                publisher: 'The New York Times', title: 'Trump Wants to Blockade Iran',
                time: '12h ago', authors: 'Ben Hubbard', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // 2 & 3. Grid: Pope Leo & Hungary
            {
                id: 'row-1', layout: 'grid-row',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_GRID, activeSubCardIndex: 0 },
                cards: [
                    { id: '2', image: 'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/rockcms/2025-05/250509-split-trump-pope-leo-mb-1016-aaa421.jpg', publisher: 'The Washington Post', title: "Pope Leo XIV responds to Donald Trump's criticism", time: '1d ago', authors: 'Anthony Faiola', isAppleNewsPlus: true },
                    { id: '3', image: 'https://www.reuters.com/resizer/v2/CEIWLRE3UVLHHPX6NBK2BODQ2I.jpg?auth=0aeeb4c5278d3bf3eaf73c0034a1cae1a531a268cf816f7d00e3cb77adf3ab95&width=1080&quality=80', publisher: 'Reuters', title: 'Hungarian election winner Magyar vows democratic shift', time: '5m ago', authors: 'Anita Komuves' }
                ]
            },

            // 4. List: Artemis Heat Shield
            {
                id: '4', layout: 'list',
                image: 'https://gizmodo.com/app/uploads/2026/04/Artemis-2-Splashdown-Orion-Heat-Shield-Chunk-1-960x640.jpg',
                publisher: 'Gizmodo', title: "NASA Sets the Record Straight on That ‘Missing Chunk’ of Artemis 2’s Heat Shield",
                time: '11h ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // 5. List: Assassin's Creed
            {
                id: '5', layout: 'list',
                image: 'https://insider-gaming.com/wp-content/uploads/2026/04/Black-Flag-rating.jpg',
                publisher: 'insider-gaming', title: "ASSASSIN'S CREED BLACK FLAG REMAKE LEAK CONFIRMS NEW CONTENT",
                time: '1h ago', authors: 'Sam Sepiol', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // 6. List: Frieren Season 2
            {
                id: '6', layout: 'list',
                image: 'https://comicbook.com/wp-content/uploads/sites/4/2026/04/Frieren-Fern-Season-2.jpeg?resize=1024,576',
                publisher: 'ComicBook', title: "Frieren: Beyond Journey’s End Opens Up About Major Change in Season 2",
                time: '9h ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // 7. List: Evanescence
            {
                id: '7', layout: 'list',
                image: 'https://assets.blabbermouth.net/media/amyleeapril2026_638.jpg',
                publisher: 'BLABBERMOUTH.NET', title: "EVANESCENCE'S AMY LEE On Upcoming 'Sanctuary' Album",
                time: '4h ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // 8. List (For You): Missouri Town
            {
                id: '8', layout: 'list', sectionTitle: 'For You', hasNewsPlusHeader: true,
                image: 'https://www.politico.com/dims4/default/resize/630/quality/90/format/webp?url=https%3A%2F%2Fstatic.politico.com%2Fe7%2F67%2F6dc03ce8483fa6c3160c6b164ebf%2Fcw-0413-tomich-2000-01.jpg',
                publisher: 'POLITICO', title: 'Missouri town fires half its city council over data center deal',
                time: '12h ago', authors: 'Jeff Tomich', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // === РЕКЛАМА (Разрыв сетки) ===
            {
                id: 'ad-1', layout: 'ad',
                adBannerText: 'Beat the April 15 tax deadline!',
                title: 'File your<br><span style="color: #FF7A8A;">taxes free</span>',
                buttonText: 'Get the app',
                logoText: '<svg viewBox="0 0 24 24"><path fill="#E2445C" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg><div>turbotax<br><span style="font-size: 9px; font-weight: normal;">Free Edition</span></div>',
                image: 'https://placehold.co/600x300/1C1E21/1C1E21?text=W-2+Forms+Here', 
                disclaimer: '~37% of filers qualify. Simple Form 1040 returns only (no schedules, except for EITC, CTC, student loan interest, and Schedule 1-A).'
            },

            // 9. Hero: Project Hail Mary
            {
                id: '9', layout: 'hero', sectionTitle: 'Entertainment', sectionSubtitle: 'Movies, TV & Pop Culture.',
                image: 'https://static0.srcdn.com/wordpress/wp-content/uploads/2026/04/ryan-gosling-looking-at-something-in-project-hail-mary.jpg?q=70&fit=crop&w=1600&h=900&dpr=1',
                publisher: 'ScreenRant', title: "Ridley Scott's Sci-Fi Masterpiece Officially Surpassed By Project Hail Mary",
                time: '3d ago', authors: 'Jeff Dodge', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            
            // 10 & 11. Grid: Call of Duty & Next Project Hail Mary
            {
                id: 'row-2', layout: 'grid-row',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_GRID, activeSubCardIndex: 0 },
                cards: [
                    { id: '10', image: 'https://images.purexbox.com/d010fecadf093/rumour-microsoft-might-not-launch-call-of-duty-2026-on-xbox-game-pass.900x.jpg', publisher: 'PUREXBOX', title: 'Rumour: Microsoft Might Not Launch Call Of Duty 2026 On Xbox Game Pass', time: '1d ago', authors: 'Ben Kerry' },
                    { id: '11', image: 'https://www.comingsoon.net/wp-content/uploads/sites/3/2026/04/Next-Project-Hail-Mary-Story-From-Andy-Weir-Revealed-With-Videos-Photo.jpg?resize=1024,576', publisher: 'ComingSoon', title: 'Next Project Hail Mary Story From Andy Weir Revealed', time: '4d ago', authors: 'Movies' }
                ]
            },

            // 12 & 13. Grid: The Strokes & Obama
            {
                id: 'row-3', layout: 'grid-row', sectionTitle: 'Reader Favorites',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_GRID, activeSubCardIndex: 0 },
                cards: [
                    { id: '12', image: 'https://www.rollingstone.com/wp-content/uploads/2026/04/GettyImages-2270941094.jpg?w=1581&h=1054&crop=1', publisher: '<span style="color: #D22027; font-weight: 900;">Rolling Stone</span>', title: "THE STROKES SET SUMMER TOUR IN SUPPORT OF 'REALITY AWAITS'", time: '5h ago', authors: 'Daniel Kreps' },
                    { id: '13', isAppleNewsPlus: true, image: 'https://www.thedailybeast.com/resizer/v2/KPDBN74UMBHUNNI2H32KD3IRYI.jpg?smart=true&auth=801a0ee0a9fb568f0fb079d3151a1a1ce614b1b1ff3c6cf8cdb0774fe11d2760&width=1600&height=900', publisher: 'DAILY BEAST', title: "Obama Twists the Knife After JD Vance’s Humiliation", time: '14h ago', authors: 'Harry Thompson' }
                ]
            },

            // 14. Hero: Swalwell
            {
                id: '14', layout: 'hero', sectionTitle: 'Politics',
                image: 'https://dims.apnews.com/dims4/default/1db0337/2147483647/strip/true/crop/5000x3439+0+0/resize/1440x990!/format/webp/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F6f%2F3c%2F7b67d80fae0429c3ba1b862195d1%2F3f9e40474b2d438bbc59c175026f7f0d',
                publisher: '<span style="color: #FF3333; font-weight: bold;">AP News</span>', title: 'Swalwell exits California governor’s race after assault allegations',
                time: '2h ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // 15. Trending: Pope in Algeria
            {
                id: '15', layout: 'trending', sectionTitle: 'Trending Stories', isTrendingSection: true, rank: 1,
                publisher: 'BBC', title: "Leo becomes first Pope to visit Algeria at start of major Africa tour",
                time: '4h ago', authors: 'Lebo Diseko', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // === РЕЦЕПТЫ ===
            {
                id: 'row-food', layout: 'grid-row', sectionTitle: 'Spring Pastas', sectionSubtitle: 'Selected by the Apple News editors.',
                disableSwipe: true,
                cards: [
                    { id: '202', type: 'recipe', isAppleNewsPlus: true, image: 'https://placehold.co/300x350/e1e4e8/999999?text=Penne+Skillet', publisher: 'EatingWell', title: 'Marry-Me Chicken-and-Spinach Penne Skillet', time: '35m' },
                    { id: '203', type: 'recipe', isAppleNewsPlus: true, image: 'https://placehold.co/300x350/e1e4e8/999999?text=Pasta+Salad', publisher: '<strong>FOOD</strong>&<strong>WINE</strong>', title: 'Caprese-Pesto Pasta Salad', time: '20m' }
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
            if(!state) return { maxRight: 0, maxLeft: 0 };
            
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
            if (news.disableSwipe || !news.swipeState) return { transform: 'translateX(0px)', opacity: 1, zIndex: 1, pointerEvents: 'auto' };
            
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
            if (news.disableSwipe || !news.swipeState) return { opacity: 0 };
            
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
            if (!card || card.disableSwipe) return;

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
            if (!activeSwipeCard || !activeSwipeCard.swipeState || !activeSwipeCard.swipeState.isSwiping) return;
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
            if (!activeSwipeCard || !activeSwipeCard.swipeState) return;
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
            if (card && card.swipeState) { card.swipeState.offsetX = 0; }
        };

       return {
            currentDate, currentTab, tabs, topics, topStories, getIconStyle, getButtonStyle, getGridCardStyle,
            handleSwipeStart, onLike, onDislike, onSave, onShare
        };
    }
}).mount('#app');