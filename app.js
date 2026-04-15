const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const currentDate = ref('');
        const currentTab = ref('today');
        const SWIPE_OFFSET_NORMAL = 170; 
        const SWIPE_OFFSET_GRID = 100;   
        let activeSwipeCard = null;

        const tabs = ref([
            { id: 'today', name: 'Today', svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Apple News</title><path d="M0 12.9401c2.726 4.6726 6.3944 8.385 11.039 11.0582H1.4164C.634 23.9983 0 23.3639 0 22.5819v-9.6418ZM0 1.4138C0 .6337.632.0018 1.4116.0018h4.8082L24 17.7583v4.773c0 .3891-.1544.762-.4295 1.0373a1.4674 1.4674 0 0 1-1.037.4296h-4.774L0 6.2416M12.9634.0017h9.6182A1.4187 1.4187 0 0 1 24 1.4205v9.6256C21.2648 6.4935 17.6157 2.7745 12.9634.0017Z"/></svg>` },
            { id: 'news', name: 'News+', svg: `<svg viewBox='0 0 78.92 98.32' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' clip-rule='evenodd' d='M.07,10.66v78.44c-.56,6.81,2.48,9.95,9.46,9.07h61.1c5.39.36,8.32-2.19,8.28-8.28V6.72c.25-4.89-3.6-6.91-10.64-6.7H7.56C3.09.22.67,3.88.07,10.66Z M31.3,9.89c-.42-.2-.29-.84.18-.84,2.67-.03,8.85.01,22.85.11,17.12,0,15.21-.04,15.21,18.34,0,.33-.34.56-.63.42-15.78-7.53-32.39-15.52-37.61-18.04Z M8.68,23.52c27.92,13.54,29.12,14.12,58.1,27.74,1.29.6,2.77-.33,2.77-1.75v-11.05c0-.72-.38-1.37-1.02-1.71-6.67-3.5-44.03-23.01-52.68-25.79-.19-.06-.38-.08-.58-.08-8.6-.04-8-1.6-7.69,10.92.02.73.46,1.41,1.11,1.73Z'/></svg>` },
            { id: 'audio', name: 'Audio', svg: `<svg viewBox='0 0 105.01 107.09' xmlns='http://www.w3.org/2000/svg'><path fill='currentColor' d='M25.62,63.5c4.72.21,10.13,12.7,12.2,22.15.5,2.27.73,4.25.84,5.74.04.5.12.99.23,1.48.02.09.04.19.06.29,1.44,7.22-4.19,13.93-11.56,13.92h-.22c-3.27,0-7.43-1.42-7.43-1.42-6.55-2.37-7.72-5.4-12.56-12.14-.65-.91-1.18-1.92-1.56-2.98C1.07,77.66.96,77.05.06,67.58c-.04-.37-.05-.74-.06-1.12-.01-4.52.42-19.89.54-24.19.02-.79.12-1.56.3-2.33,1.19-5.04,3.92-13.28,10.51-21.21C25.18,2.09,44.77.4,48.24.16c4.52-.31,18.29-1.06,31.34,7.8,9.29,6.31,13.62,14.38,16.55,20.01,12.93,24.83,11.1,56.53-1.26,69.69-1.43,1.52-6.44,5.38-13.59,8.01-.54.2-6.27,2.19-11.38-1.37-1.83-1.28-3.01-2.87-3.77-4.31-.9-1.73-1.29-3.68-1.23-5.63.45-14.42.99-25.72,11.66-30.07,6.74-2.74,11.97-2.83,11.77-3.4,1.55-.34,2.43-13.17-.65-21.64-3.16-10.4-10.42-16.48-13.36-18.95-2.41-2.03-9.55-7.5-20.02-7.96-13.12-.57-22.13,5-24.65,7.26-7.82,7.04-5.92,4.62-10.52,11.33-.79,1.16-1.45,2.44-1.72,3.82-6.12,30.81-6.59,28.74,8.21,28.76Z'/></svg>` },
            { id: 'following', name: 'Following', svg: `<svg viewBox='0 0 78.32 103.61' xmlns='http://www.w3.org/2000/svg'><path fill='currentColor' fill-rule='evenodd' clip-rule='evenodd' d='M9.88,25.07h60.28s8.17.42,8.17,7.89v61.12s.19,8.97-12.11,9.29c-12.3.33-46.55.31-56.33,0C.09,103.07.02,90.98.02,90.98.02,90.98-.03,41.66.02,33.8s9.86-8.73,9.86-8.73Z M9.9,19.25q30.33.09,61.03,0c-4.69-9.2-3.94-7.32-30.51-7.6-27.32.09-27.51-.09-30.51,7.6Z M18.02,7.91q22.26.1,44.79,0C59.37-1.66,59.92.29,40.42,0c-20.05.1-20.19-.1-22.4,7.91Z'/></svg>` }
        ]);

        const topics = ref([
            // Используем свойство icon и вставляем туда строку с SVG
            { name: 'Sports', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.748 17.9785" fill="currentColor"><path d="M0 12.3535L2.41211 12.3535C3.16406 12.3535 3.57422 11.9434 3.57422 11.1914L3.57422 6.79688C3.57422 6.04492 3.16406 5.63477 2.41211 5.63477L0 5.63477ZM3.71094 17.9785L12.4805 17.9785L12.4805 13.6914C10.1758 13.3496 8.42773 11.377 8.42773 8.98438C8.42773 6.5918 10.1758 4.60938 12.4805 4.27734L12.4805 0L3.71094 0C1.32812 0 0 1.32812 0 3.71094L0 4.25781L2.40234 4.25781C4.05273 4.25781 4.95117 5.15625 4.95117 6.79688L4.95117 11.1914C4.95117 12.832 4.05273 13.7305 2.40234 13.7305L0 13.7305L0 14.2676C0 16.6504 1.32812 17.9785 3.71094 17.9785ZM12.4805 12.334L12.4805 10.4395C11.9434 10.1758 11.5723 9.61914 11.5723 8.98438C11.5723 8.33984 11.9434 7.79297 12.4805 7.5293L12.4805 5.63477C10.918 5.94727 9.75586 7.32422 9.75586 8.98438C9.75586 10.6445 10.918 12.0117 12.4805 12.334ZM13.916 12.334C15.4688 12.0117 16.6406 10.6445 16.6406 8.98438C16.6406 7.32422 15.4688 5.94727 13.916 5.63477L13.916 7.5293C14.4531 7.79297 14.8145 8.33984 14.8145 8.98438C14.8145 9.61914 14.4531 10.1758 13.916 10.4395ZM13.916 17.9785L22.6758 17.9785C25.0586 17.9785 26.3867 16.6504 26.3867 14.2676L26.3867 13.7305L23.9844 13.7305C22.334 13.7305 21.4453 12.832 21.4453 11.1914L21.4453 6.79688C21.4453 5.15625 22.334 4.25781 23.9844 4.25781L26.3867 4.25781L26.3867 3.71094C26.3867 1.32812 25.0586 0 22.6758 0L13.916 0L13.916 4.27734C16.2109 4.60938 17.9688 6.5918 17.9688 8.98438C17.9688 11.377 16.2109 13.3496 13.916 13.6914ZM26.3867 12.3535L26.3867 5.63477L23.9746 5.63477C23.2227 5.63477 22.8223 6.04492 22.8223 6.79688L22.8223 11.1914C22.8223 11.9434 23.2227 12.3535 23.9746 12.3535Z"/></svg>' },
            { name: 'Puzzles', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.6426 18.8379" fill="currentColor"><path d="M0 9.4043C0 11.3965 1.40625 12.4902 2.98828 12.4902C3.65234 12.4902 4.15039 12.3047 4.74609 11.9336C5.30273 11.5918 5.70312 11.7969 5.70312 12.2754L5.70312 15.8887C5.70312 17.8125 6.71875 18.7988 8.66211 18.7988L11.2695 18.7988C11.7383 18.7988 11.9434 18.4082 11.6113 17.8516C11.2305 17.2559 11.0449 16.7578 11.0449 16.0938C11.0449 14.5117 12.1484 13.1055 14.1406 13.1055C16.1328 13.1055 17.2266 14.5117 17.2266 16.0938C17.2266 16.7578 17.041 17.2559 16.6699 17.8516C16.3379 18.4082 16.5332 18.7988 17.0117 18.7988L19.6191 18.7988C21.5625 18.7988 22.5781 17.8125 22.5781 15.8887L22.5781 12.2754C22.5781 11.7969 22.9785 11.5918 23.5254 11.9336C24.1309 12.3047 24.6289 12.4902 25.2832 12.4902C26.875 12.4902 28.2812 11.3965 28.2812 9.4043C28.2812 7.40234 26.875 6.30859 25.2832 6.30859C24.6289 6.30859 24.1309 6.49414 23.5254 6.86523C22.9785 7.20703 22.5781 7.00195 22.5781 6.52344L22.5781 2.91016C22.5781 0.996094 21.5625 0 19.6191 0L17.0117 0C16.5332 0 16.3379 0.400391 16.6699 0.957031C17.041 1.55273 17.2266 2.05078 17.2266 2.71484C17.2266 4.29688 16.1328 5.70312 14.1406 5.70312C12.1484 5.70312 11.0449 4.29688 11.0449 2.71484C11.0449 2.05078 11.2305 1.55273 11.6113 0.957031C11.9434 0.400391 11.7383 0 11.2695 0L8.66211 0C6.71875 0 5.70312 0.996094 5.70312 2.91016L5.70312 6.52344C5.70312 7.00195 5.30273 7.20703 4.74609 6.86523C4.15039 6.49414 3.65234 6.30859 2.98828 6.30859C1.40625 6.30859 0 7.40234 0 9.4043Z"/></svg>' },
            { name: 'Local', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C8.1,2,5,5.1,5,9c0,6,7,13,7,13s7-7.1,7-13C19,5.1,15.9,2,12,2z M12,11.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5 s2.5,1.1,2.5,2.5S13.4,11.5,12,11.5z"/></svg>' },
            { name: 'Entertainment', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9h12l-1 10H7L6 9Z" stroke="black" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 7c0-1 1-2 2-2s2 1 2 2c0-1 1-2 2-2s2 1 2 2" stroke="black" stroke-width="1.5" stroke-linecap="round"/><path d="M10 9v10M14 9v10" stroke="black" stroke-width="1.2"/></svg>' },
            { name: 'Technology', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="6" y="6" width="12" height="12" rx="2" stroke="black" stroke-width="1.5"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"stroke="black" stroke-width="1.5" stroke-linecap="round"/></svg>' } 
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
                id: '8', layout: 'list', sectionTitle: 'For You', sectionSubtitle: 'Recommendation based on topics & channels you read.', hasNewsPlusHeader: true,
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