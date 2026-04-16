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
            { id: 'audio', name: 'Audio', svg: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 6.50391C0 2.5957 2.41406 0 6.05859 0C9.70898 0 12.1289 2.5957 12.1289 6.50391C12.1289 8.2793 11.6074 10.2422 10.7402 11.7598C10.5762 12.0469 10.2656 12.1348 9.9668 11.9941C9.68555 12.4102 9.19336 12.5801 8.63086 12.416C7.93359 12.1992 7.61133 11.5957 7.82812 10.8926L8.67188 8.10938C8.88281 7.41797 9.48047 7.10156 10.1836 7.30664C10.4883 7.40039 10.7168 7.56445 10.8633 7.77539C10.9277 7.34766 10.957 6.91992 10.957 6.50391C10.957 3.29883 8.99414 1.16602 6.05859 1.16602C3.12305 1.16602 1.16602 3.29883 1.16602 6.50391C1.16602 6.91992 1.20117 7.34766 1.25977 7.77539C1.40625 7.55859 1.63477 7.39453 1.93359 7.30664C2.64258 7.10156 3.24023 7.41797 3.45117 8.10938L4.29492 10.8926C4.50586 11.5898 4.18945 12.1992 3.48633 12.416C2.92969 12.5801 2.4375 12.4102 2.15039 11.9883C1.85742 12.1348 1.54688 12.0469 1.38281 11.7598C0.515625 10.2422 0 8.2793 0 6.50391Z" fill="currentColor"/></svg>` },
            { id: 'following', name: 'Following', svg: `<svg viewBox='0 0 78.32 103.61' xmlns='http://www.w3.org/2000/svg'><path fill='currentColor' fill-rule='evenodd' clip-rule='evenodd' d='M9.88,25.07h60.28s8.17.42,8.17,7.89v61.12s.19,8.97-12.11,9.29c-12.3.33-46.55.31-56.33,0C.09,103.07.02,90.98.02,90.98.02,90.98-.03,41.66.02,33.8s9.86-8.73,9.86-8.73Z M9.9,19.25q30.33.09,61.03,0c-4.69-9.2-3.94-7.32-30.51-7.6-27.32.09-27.51-.09-30.51,7.6Z M18.02,7.91q22.26.1,44.79,0C59.37-1.66,59.92.29,40.42,0c-20.05.1-20.19-.1-22.4,7.91Z'/></svg>` }
        ]);

        const topics = ref([
            // Используем свойство icon и вставляем туда строку с SVG
            { name: 'Sports', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.748 17.9785" fill="currentColor"><path d="M0 12.3535L2.41211 12.3535C3.16406 12.3535 3.57422 11.9434 3.57422 11.1914L3.57422 6.79688C3.57422 6.04492 3.16406 5.63477 2.41211 5.63477L0 5.63477ZM3.71094 17.9785L12.4805 17.9785L12.4805 13.6914C10.1758 13.3496 8.42773 11.377 8.42773 8.98438C8.42773 6.5918 10.1758 4.60938 12.4805 4.27734L12.4805 0L3.71094 0C1.32812 0 0 1.32812 0 3.71094L0 4.25781L2.40234 4.25781C4.05273 4.25781 4.95117 5.15625 4.95117 6.79688L4.95117 11.1914C4.95117 12.832 4.05273 13.7305 2.40234 13.7305L0 13.7305L0 14.2676C0 16.6504 1.32812 17.9785 3.71094 17.9785ZM12.4805 12.334L12.4805 10.4395C11.9434 10.1758 11.5723 9.61914 11.5723 8.98438C11.5723 8.33984 11.9434 7.79297 12.4805 7.5293L12.4805 5.63477C10.918 5.94727 9.75586 7.32422 9.75586 8.98438C9.75586 10.6445 10.918 12.0117 12.4805 12.334ZM13.916 12.334C15.4688 12.0117 16.6406 10.6445 16.6406 8.98438C16.6406 7.32422 15.4688 5.94727 13.916 5.63477L13.916 7.5293C14.4531 7.79297 14.8145 8.33984 14.8145 8.98438C14.8145 9.61914 14.4531 10.1758 13.916 10.4395ZM13.916 17.9785L22.6758 17.9785C25.0586 17.9785 26.3867 16.6504 26.3867 14.2676L26.3867 13.7305L23.9844 13.7305C22.334 13.7305 21.4453 12.832 21.4453 11.1914L21.4453 6.79688C21.4453 5.15625 22.334 4.25781 23.9844 4.25781L26.3867 4.25781L26.3867 3.71094C26.3867 1.32812 25.0586 0 22.6758 0L13.916 0L13.916 4.27734C16.2109 4.60938 17.9688 6.5918 17.9688 8.98438C17.9688 11.377 16.2109 13.3496 13.916 13.6914ZM26.3867 12.3535L26.3867 5.63477L23.9746 5.63477C23.2227 5.63477 22.8223 6.04492 22.8223 6.79688L22.8223 11.1914C22.8223 11.9434 23.2227 12.3535 23.9746 12.3535Z"/></svg>' },
            { name: 'Puzzles', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.6426 18.8379" fill="currentColor"><path d="M0 9.4043C0 11.3965 1.40625 12.4902 2.98828 12.4902C3.65234 12.4902 4.15039 12.3047 4.74609 11.9336C5.30273 11.5918 5.70312 11.7969 5.70312 12.2754L5.70312 15.8887C5.70312 17.8125 6.71875 18.7988 8.66211 18.7988L11.2695 18.7988C11.7383 18.7988 11.9434 18.4082 11.6113 17.8516C11.2305 17.2559 11.0449 16.7578 11.0449 16.0938C11.0449 14.5117 12.1484 13.1055 14.1406 13.1055C16.1328 13.1055 17.2266 14.5117 17.2266 16.0938C17.2266 16.7578 17.041 17.2559 16.6699 17.8516C16.3379 18.4082 16.5332 18.7988 17.0117 18.7988L19.6191 18.7988C21.5625 18.7988 22.5781 17.8125 22.5781 15.8887L22.5781 12.2754C22.5781 11.7969 22.9785 11.5918 23.5254 11.9336C24.1309 12.3047 24.6289 12.4902 25.2832 12.4902C26.875 12.4902 28.2812 11.3965 28.2812 9.4043C28.2812 7.40234 26.875 6.30859 25.2832 6.30859C24.6289 6.30859 24.1309 6.49414 23.5254 6.86523C22.9785 7.20703 22.5781 7.00195 22.5781 6.52344L22.5781 2.91016C22.5781 0.996094 21.5625 0 19.6191 0L17.0117 0C16.5332 0 16.3379 0.400391 16.6699 0.957031C17.041 1.55273 17.2266 2.05078 17.2266 2.71484C17.2266 4.29688 16.1328 5.70312 14.1406 5.70312C12.1484 5.70312 11.0449 4.29688 11.0449 2.71484C11.0449 2.05078 11.2305 1.55273 11.6113 0.957031C11.9434 0.400391 11.7383 0 11.2695 0L8.66211 0C6.71875 0 5.70312 0.996094 5.70312 2.91016L5.70312 6.52344C5.70312 7.00195 5.30273 7.20703 4.74609 6.86523C4.15039 6.49414 3.65234 6.30859 2.98828 6.30859C1.40625 6.30859 0 7.40234 0 9.4043Z"/></svg>' },
            { name: 'Local', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C8.1,2,5,5.1,5,9c0,6,7,13,7,13s7-7.1,7-13C19,5.1,15.9,2,12,2z M12,11.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5 s2.5,1.1,2.5,2.5S13.4,11.5,12,11.5z"/></svg>' },
            { 
                name: 'Entertainment', 
                icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 21.1426 27.3535"><g><rect height="27.3535" opacity="0" width="21.1426" x="0" y="0"/><path d="M6.68945 11.3281L7.88086 24.4531L6.5332 24.4531C5.13672 24.4531 4.45312 23.6426 4.18945 22.2559L2.26562 12.1289C1.91406 10.2539 3.19336 9.28711 4.46289 9.28711C5.51758 9.28711 6.57227 9.95117 6.68945 11.3281ZM12.7344 11.416L12.0634 18.9433C10.7922 19.5649 10 20.8489 10 22.2754C10 23.0805 10.2498 23.8331 10.6958 24.4531L9.16016 24.4531L7.98828 11.416C7.83203 9.6582 9.30664 8.96484 10.3613 8.96484C11.416 8.96484 12.8906 9.6582 12.7344 11.416ZM18.457 12.1289L17.5314 17.026C16.9838 16.6872 16.3288 16.4941 15.6152 16.4941C14.8207 16.4941 14.0944 16.735 13.5091 17.15L14.0332 11.3281C14.1602 9.95117 15.2148 9.28711 16.2598 9.28711C17.5293 9.28711 18.8184 10.2539 18.457 12.1289ZM11.1523 2.87109C11.4258 2.8125 11.7578 2.83203 12.002 2.90039C12.4707 2.4707 13.0859 2.23633 13.7598 2.23633C14.8145 2.23633 15.5762 2.87109 15.9863 3.81836C17.5293 3.85742 18.6133 5.03906 18.6133 6.71875C18.6133 7.36328 18.4082 7.93945 18.0664 8.42773C17.5098 8.125 16.8652 7.96875 16.2402 7.96875C15.1953 7.96875 14.1602 8.36914 13.4863 9.19922C12.793 8.19336 11.582 7.63672 10.3613 7.63672C9.14062 7.63672 7.92969 8.19336 7.23633 9.19922C6.5625 8.36914 5.53711 7.96875 4.51172 7.96875C3.84766 7.96875 3.19336 8.13477 2.62695 8.44727C2.32422 7.96875 2.19727 7.49023 2.19727 6.97266C2.19727 5.47852 3.42773 4.24805 4.91211 4.29688C4.91211 3.63281 5.53711 2.94922 6.28906 3.01758C6.45508 2.16797 7.37305 1.31836 8.75977 1.31836C9.80469 1.31836 10.7227 1.92383 11.1523 2.87109Z" fill="currentColor"/><path d="M15.6152 26.0156C16.5625 26.0156 17.4316 25.4785 17.8516 24.6582C19.1602 24.3652 19.8145 23.3398 19.8145 22.2852C19.8145 21.2012 19.1211 20.1758 17.8516 19.9707C17.8125 18.7305 16.875 17.832 15.6152 17.832C14.375 17.832 13.4473 18.7012 13.3887 19.9023C12.0703 20.1074 11.3379 21.1719 11.3379 22.2754C11.3379 23.3691 12.0605 24.4043 13.3789 24.6777C13.7695 25.4785 14.6387 26.0156 15.6152 26.0156Z" fill="currentColor"/></g></svg>' 
            }, 
            { name: 'Technology', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="6" y="6" width="12" height="12" rx="2" stroke="black" stroke-width="1.5"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"stroke="black" stroke-width="1.5" stroke-linecap="round"/></svg>' } 
        ]);

        const getIconStyle = (svgString) => {
            let url = svgString.startsWith('http') ? `url("${svgString}")` : `url("data:image/svg+xml;utf8,${encodeURIComponent(svgString)}")`;
            return { maskImage: url, WebkitMaskImage: url };
        };

            const topStories = ref([
            // === TOP STORIES ===
            {
                id: 'top-1', layout: 'hero', sectionTitle: 'Top Stories', sectionColor: 'var(--apple-red)',
                image: 'https://static01.nyt.com/images/2026/04/13/multimedia/13int-iran-global-pbkf/13int-iran-global-pbkf-superJumbo.jpg?quality=75&auto=webp',
                publisher: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/NewYorkTimes.svg/1280px-NewYorkTimes.svg.png" alt="The New York Times">', 
                title: 'Trump Wants to Blockade Iran',
                time: '12h ago', authors: 'Ben Hubbard', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'top-2', layout: 'list',
                image: 'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-760w,f_auto,q_auto:best/rockcms/2025-05/250509-split-trump-pope-leo-mb-1016-aaa421.jpg',
                publisher: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/The_Logo_of_The_Washington_Post_Newspaper.svg/1280px-The_Logo_of_The_Washington_Post_Newspaper.svg.png" alt="The Washington Post">', 
                title: "Pope Leo XIV responds to Donald Trump's criticism",
                time: '1d ago', authors: 'Anthony Faiola',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'top-3', layout: 'list',
                image: 'https://www.reuters.com/resizer/v2/CEIWLRE3UVLHHPX6NBK2BODQ2I.jpg?auth=0aeeb4c5278d3bf3eaf73c0034a1cae1a531a268cf816f7d00e3cb77adf3ab95&width=1080&quality=80',
                publisher: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Reuters_Logo.svg/1280px-Reuters_Logo.svg.png" alt="Reuters">', 
                title: 'Hungarian election winner Magyar vows democratic shift',
                time: '5m ago', authors: 'Anita Komuves',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'top-4', layout: 'list',
                image: 'https://gizmodo.com/app/uploads/2026/04/Artemis-2-Splashdown-Orion-Heat-Shield-Chunk-1-960x640.jpg',
                publisher: 'Gizmodo', title: "NASA Sets the Record Straight on That ‘Missing Chunk’ of Artemis 2’s Heat Shield",
                time: '11h ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'top-5', layout: 'list',
                image: 'https://insider-gaming.com/wp-content/uploads/2026/04/Black-Flag-rating.jpg',
                publisher: 'Insider Gaming', title: "ASSASSIN'S CREED BLACK FLAG REMAKE LEAK CONFIRMS NEW CONTENT",
                time: '1h ago', authors: 'Sam Sepiol', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'top-6', layout: 'list',
                image: 'https://comicbook.com/wp-content/uploads/sites/4/2026/04/Frieren-Fern-Season-2.jpeg?resize=1024,576',
                publisher: 'ComicBook', title: "Frieren: Beyond Journey’s End Opens Up About Major Change in Season 2",
                time: '9h ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // === FOR YOU (Обычное, без плашки подписки) ===
            {
                id: 'foryou-1', layout: 'list', sectionTitle: 'For You', sectionColor: 'var(--apple-green)', sectionSubtitle: 'Recommendations based on topics & channels you read.',
                image: 'https://i.guim.co.uk/img/media/26524c089f7682565ba3ce23c8059727045b97e6/0_0_3500_2333/master/3500.jpg?width=620&dpr=1&s=none&crop=none',
                publisher: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/The_Guardian_2018.svg/3840px-The_Guardian_2018.svg.png" alt="The Guardian">', 
                title: 'Bernie Sanders pushes resolutions to block US weapons sales to Israel',
                time: '4h ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'foryou-2', layout: 'list',
                image: 'https://static01.nyt.com/images/2026/04/13/multimedia/13trump-news-pope-vance-jlbz/13trump-news-pope-vance-jlbz-articleLarge.jpg?quality=75&auto=webp&disable=upscale',
                publisher: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Associated_Press_logo_2012.svg/250px-Associated_Press_logo_2012.svg.png" alt="AP">', 
                title: "As Vance rallies with Turning Point, some supporters bristle at Trump's war, memes and feuds",
                time: '6h ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'foryou-3', layout: 'list',
                image: 'https://static01.nyt.com/images/2026/04/15/multimedia/15int-italy-meloni-01-jzbm/15int-italy-meloni-01-jzbm-superJumbo.jpg?quality=75&auto=webp',
                publisher: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/NewYorkTimes.svg/1280px-NewYorkTimes.svg.png" alt="The New York Times">', 
                title: 'Trump and Meloni Split Amid Growing Dispute Over Pope and Iran',
                time: '1h ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
             {
                id: 'foryou-4', layout: 'list', hasNewsPlusHeader: true,
                image: 'https://www.politico.com/dims4/default/resize/630/quality/90/format/webp?url=https%3A%2F%2Fstatic.politico.com%2Fe7%2F67%2F6dc03ce8483fa6c3160c6b164ebf%2Fcw-0413-tomich-2000-01.jpg',
                publisher: '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi4XPw5Z-nU0ClRsalvSb4yfRzc4gCNP4hnQ&s" alt="POLITICO">', 
                title: 'Missouri town fires half its city council over data center deal',
                time: '12h ago', authors: 'Jeff Tomich', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // === POLITICS ===
            {
                id: 'pol-1', layout: 'hero', sectionTitle: 'Politics',
                image: 'https://dims.apnews.com/dims4/default/1db0337/2147483647/strip/true/crop/5000x3439+0+0/resize/1440x990!/format/webp/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F6f%2F3c%2F7b67d80fae0429c3ba1b862195d1%2F3f9e40474b2d438bbc59c175026f7f0d',
                publisher: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Associated_Press_logo_2012.svg/250px-Associated_Press_logo_2012.svg.png" alt="AP News">', 
                title: 'Swalwell exits California governor’s race after assault allegations',
                time: '2h ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'pol-2', layout: 'list',
                image: 'https://www.politico.com/dims4/default/resize/630/quality/90/format/webp?url=https%3A%2F%2Fstatic.politico.com%2Ffc%2F92%2Fa845fec9435f94c0fbae9eea1056%2Fu-s-congress-84756.jpg',
                publisher: '<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi4XPw5Z-nU0ClRsalvSb4yfRzc4gCNP4hnQ&s" alt="POLITICO">', 
                title: 'Johnson backs Trump, Vance in criticism of pope',
                time: '14h ago', authors: 'Cheyanne M. Daniels', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'pol-3', layout: 'list',
                image: 'https://www.amu.apus.edu/images/site/amu/us-iran.jpg',
                publisher: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/The_Logo_of_The_Washington_Post_Newspaper.svg/1280px-The_Logo_of_The_Washington_Post_Newspaper.svg.png" alt="The Washington Post">', 
                title: 'U.S. sends thousands more troops to Mideast as Trump seeks to squeeze Iran',
                time: '12h ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // === РЕКЛАМА 1 ===
            {
                id: 'ad-1', layout: 'ad',
                adBannerText: 'Beat the April 15 tax deadline!',
                title: 'File your<br><span style="color: #FF7A8A;">taxes free</span>',
                buttonText: 'Get the app',
                logoText: '<svg viewBox="0 0 24 24"><path fill="#E2445C" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg><div>turbotax<br><span style="font-size: 9px; font-weight: normal;">Free Edition</span></div>',
                image: 'https://placehold.co/600x300/1C1E21/1C1E21?text=W-2+Forms+Here', 
                disclaimer: '~37% of filers qualify. Simple Form 1040 returns only (no schedules, except for EITC, CTC, student loan interest, and Schedule 1-A).'
            },

            // === ENTERTAINMENT ===
            {
                id: 'ent-1', layout: 'hero', sectionTitle: 'Entertainment', sectionSubtitle: 'Movies, TV & Pop Culture.',
                image: 'https://static0.srcdn.com/wordpress/wp-content/uploads/2026/04/ryan-gosling-looking-at-something-in-project-hail-mary.jpg?q=70&fit=crop&w=1600&h=900&dpr=1',
                publisher: 'ScreenRant', title: "Ridley Scott's Sci-Fi Masterpiece Officially Surpassed By Project Hail Mary",
                time: '3d ago', authors: 'Jeff Dodge', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'ent-2', layout: 'grid-row', 
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_GRID, activeSubCardIndex: 0 },
                cards: [
                    { id: 'ent-2a', image: 'https://images.purexbox.com/d010fecadf093/rumour-microsoft-might-not-launch-call-of-duty-2026-on-xbox-game-pass.900x.jpg', publisher: 'PUREXBOX', title: 'Rumour: Microsoft Might Not Launch Call Of Duty 2026 On Xbox Game Pass', time: '1d ago', authors: 'Ben Kerry' },
                    { id: 'ent-2b', image: 'https://www.comingsoon.net/wp-content/uploads/sites/3/2026/04/Next-Project-Hail-Mary-Story-From-Andy-Weir-Revealed-With-Videos-Photo.jpg?resize=1024,576', publisher: 'ComingSoon', title: 'Next Project Hail Mary Story From Andy Weir Revealed', time: '4d ago', authors: 'Movies' }
                ]
            },
            {
                id: 'ent-3', layout: 'list',
                image: 'https://assets.blabbermouth.net/media/amyleeapril2026_638.jpg',
                publisher: 'BLABBERMOUTH.NET', title: "EVANESCENCE'S AMY LEE On Upcoming 'Sanctuary' Album",
                time: '4h ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // === TRENDING ===
            {
                id: 'trend-1', layout: 'trending', sectionTitle: 'Trending Stories', isTrendingSection: true, rank: 1,
                publisher: 'BBC', title: "Leo becomes first Pope to visit Algeria at start of major Africa tour",
                time: '4h ago', authors: 'Lebo Diseko', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'trend-2', layout: 'trending', rank: 2,
                publisher: '<span style="color: #D22027; font-weight: 900;">Rolling Stone</span>', title: "THE STROKES SET SUMMER TOUR IN SUPPORT OF 'REALITY AWAITS'",
                time: '5h ago', authors: 'Daniel Kreps',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'trend-3', layout: 'trending', rank: 3,
                publisher: 'DAILY BEAST', title: "Obama Twists the Knife After JD Vance’s Humiliation",
                time: '14h ago', authors: 'Harry Thompson',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // === FOOD (ЕДА) ===
            
            // 1. Главный большой заголовок
            {
                id: 'food-header', layout: 'hidden', sectionTitle: 'Food', disableSwipe: true
            },

            // 2. Первый подзаголовок (Featured Recipe)
            {
                id: 'featured-recipe-1', layout: 'recipe-hero', sectionTitle: 'Featured Recipe', sectionSubtitle: 'Selected by the Apple News editors.', isSubHeader: true,
                image: 'https://hips.hearstapps.com/hmg-prod/images/3807b2a1-0a1b-4d4d-9ebe-caaefc5b2cac.jpg', 
                publisher: '<span style="font-family: Georgia, serif; font-size: 22px;">delish</span>', 
                title: 'Crispy Green-Goddess Tofu',
                description: 'The kind of bright, simple spring dinner you’ve been itching to make.',
                time: '1h', disableSwipe: true
            },

            // 3. Второй подзаголовок (Recipes For You)
            {
                id: 'recipes-block', layout: 'recipe-carousel', sectionTitle: 'Recipes For You', isSubHeader: true,
                disableSwipe: true,
                cards: [
                    { 
                        id: 'rec-1', isAppleNewsPlus: true, 
                        bgColor: 'rgba(140, 119, 100, 0.6)', /* 👈 Полупрозрачный бежевый */
                        image: 'https://images.food52.com/a2PYZYizq3QxcGjbvjBsXCnvSbU=/031efcab-244d-46be-931f-f66dc2d6dad8--Freezer_Door_Manhattan_Credit_Lucianna_McIntosh.jpg?w=3840&q=75', 
                        publisher: 'AllRecipcer',
                        title: 'Freezer Door Manhattan', time: '2h 10m' 
                    },
                    { 
                        id: 'rec-2', isAppleNewsPlus: true, 
                        bgColor: 'rgba(59, 85, 83, 0.6)', /* 👈 Полупрозрачный темно-бирюзовый */
                        image: 'https://lemonsandzest.com/wp-content/uploads/2021/07/Protein-Overnight-Oats-3.2.jpg', 
                        publisher: 'EatingWell', 
                        title: 'Peanut Butter Protein Overnight Oats', time: '8h' 
                    },
                    { 
                        id: 'rec-3', isAppleNewsPlus: true, 
                        bgColor: 'rgba(46, 65, 48, 0.6)', /* 👈 Полупрозрачный темно-зеленый */
                        image: 'https://cleananddelicious.com/wp-content/uploads/2025/01/avocado-toast.jpg', 
                        publisher: 'Veggie', 
                        title: 'Avocado Toast', time: '10m' 
                    }
                ],
                links: [
                    { text: 'Recipe Catalog', icon: '<svg viewBox="0 0 18.3398 17.998" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.6699 17.998L16.1133 17.998C17.3535 17.998 17.9785 17.3828 17.9785 16.0938L17.9785 11.7188C17.9785 10.4395 17.3535 9.81445 16.1133 9.81445L11.6699 9.81445C10.4199 9.81445 9.79492 10.4395 9.79492 11.7188L9.79492 16.0938C9.79492 17.3828 10.4199 17.998 11.6699 17.998Z"/><path d="M1.86523 17.998L6.31836 17.998C7.55859 17.998 8.18359 17.3828 8.18359 16.0938L8.18359 11.7188C8.18359 10.4395 7.55859 9.81445 6.31836 9.81445L1.86523 9.81445C0.625 9.81445 0 10.4395 0 11.7188L0 16.0938C0 17.3828 0.625 17.998 1.86523 17.998Z"/><path d="M11.6699 8.20312L16.1133 8.20312C17.3535 8.20312 17.9785 7.57812 17.9785 6.28906L17.9785 1.92383C17.9785 0.634766 17.3535 0.0195312 16.1133 0.0195312L11.6699 0.0195312C10.4199 0.0195312 9.79492 0.634766 9.79492 1.92383L9.79492 6.28906C9.79492 7.57812 10.4199 8.20312 11.6699 8.20312Z"/><path d="M1.86523 8.20312L6.31836 8.20312C7.55859 8.20312 8.18359 7.57812 8.18359 6.28906L8.18359 1.92383C8.18359 0.634766 7.55859 0.0195312 6.31836 0.0195312L1.86523 0.0195312C0.625 0.0195312 0 0.634766 0 1.92383L0 6.28906C0 7.57812 0.625 8.20312 1.86523 8.20312Z"/></svg>' },
                    { text: 'Saved Recipes', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>' }
                ],
            },

            // === ИГРЫ И ГОЛОВОЛОМКИ (Latest Puzzles) ===
            {
                id: 'puzzles-section', layout: 'puzzles-block', sectionTitle: 'Latest Puzzles',
                disableSwipe: true,
                puzzles: [
                    {
                        type: 'hero', id: 'puz-1',
                        image: 'ico/game.png', 
                        gameName: 'Emoji Game',
                        title: 'Wednesday, Apr 15, 2569 BE',
                        author: ''
                    },
                    {
                        type: 'list', id: 'puz-2',
                        iconColor: '#FF6B4A', 
                        iconSvg: '<svg viewBox="0 0 100 100"><rect x="15" y="15" width="32" height="32" rx="8" fill="#FFC9B9"/><rect x="53" y="15" width="32" height="32" rx="8" fill="#FFFFFF"/><rect x="15" y="53" width="32" height="32" rx="8" fill="#FFFFFF"/><rect x="53" y="53" width="32" height="32" rx="8" fill="#222222"/></svg>',
                        gameName: 'Crossword Mini',
                        title: 'Wednesday, Apr 15, 2569 BE',
                        author: 'Erik Agard'
                    },
                    {
                        type: 'list', id: 'puz-3',
                        iconColor: '#1A73E8', 
                        iconSvg: '<svg viewBox="0 0 100 100"><rect x="12" y="30" width="16" height="40" rx="6" fill="#A8C7FA"/><rect x="32" y="30" width="16" height="40" rx="6" fill="#FFFFFF"/><rect x="52" y="30" width="16" height="40" rx="6" fill="#FFFFFF"/><rect x="72" y="30" width="16" height="40" rx="6" fill="#FFFFFF"/></svg>',
                        gameName: 'Quartiles',
                        title: 'Wednesday, Apr 15, 2569 BE',
                        author: ''
                    },
                    {
                        type: 'list', id: 'puz-4',
                        iconColor: '#9B26B6', 
                        iconSvg: '<svg viewBox="0 0 100 100"><rect x="16" y="16" width="20" height="20" rx="4" fill="#FFFFFF"/><rect x="40" y="16" width="20" height="20" rx="4" fill="#FFFFFF"/><rect x="64" y="16" width="20" height="20" rx="4" fill="#FFFFFF"/><rect x="16" y="40" width="20" height="20" rx="4" fill="#FFFFFF"/><rect x="40" y="40" width="20" height="20" rx="4" fill="#222222"/><rect x="64" y="40" width="20" height="20" rx="4" fill="#FFFFFF"/><rect x="16" y="64" width="20" height="20" rx="4" fill="#FFFFFF"/><rect x="40" y="64" width="20" height="20" rx="4" fill="#FFFFFF"/><rect x="64" y="64" width="20" height="20" rx="4" fill="#222222"/></svg>',
                        gameName: 'Crossword',
                        title: 'Wednesday, Apr 15, 2569 BE',
                        subtitle: 'Opening Numbers',
                        difficulty: 'Moderate',
                        author: 'Zhouqin Burnikel'
                    },
                    {
                        type: 'list', id: 'puz-5',
                        iconColor: '#34A853', 
                        iconSvg: '<svg viewBox="0 0 100 100"><rect x="18" y="18" width="22" height="22" rx="4" fill="#A8DAB5"/><text x="29" y="34" font-family="-apple-system, sans-serif" font-weight="800" font-size="16" text-anchor="middle" fill="#000">9</text><rect x="39" y="39" width="22" height="22" rx="4" fill="#FFFFFF"/><text x="50" y="55" font-family="-apple-system, sans-serif" font-weight="800" font-size="16" text-anchor="middle" fill="#000">4</text><rect x="60" y="60" width="22" height="22" rx="4" fill="#FFFFFF"/><text x="71" y="76" font-family="-apple-system, sans-serif" font-weight="800" font-size="16" text-anchor="middle" fill="#000">1</text></svg>',
                        gameName: 'Sudoku',
                        title: 'Wednesday, Apr 15, 2569 BE',
                        difficulty: 'Easy',
                        actionText: 'More sudoku'
                    }
                ]
            },

            // === SCIENCE & SPACE ===
            {
                id: 'sci-1', layout: 'list', sectionTitle: 'Science',
                image: 'https://www.nhm.ac.uk/content/dam/nhm-www/discover/what-is-space/what-is-space-milky-way-full-width.jpg',
                publisher: 'VICE', title: 'Scientists Figured Out How Fast the Universe Is Expanding, But the Answer Is Troubling',
                time: '9h ago', authors: 'Luis Prada', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'sci-2', layout: 'list',
                image: 'https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/19727037/Dragon_Carousel_0007_2.jpg?quality=90&strip=all&crop=7.8125,0,84.375,100',
                publisher: 'SPACE.com', title: 'SpaceX launches two Starlink satellite groups 19 hours apart',
                time: '16h ago', authors: 'Robert Z. Pearlman', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'sci-3', layout: 'list',
                image: 'https://gizmodo.com/app/uploads/2026/04/Artemis-2-Splashdown-Orion-Heat-Shield-Chunk-1-960x640.jpg', 
                publisher: 'Defense News', title: 'How a Navy photographer snapped an iconic Artemis II astronaut photo',
                time: '1d ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // === РЕКЛАМА 2 ===
            {
                id: 'ad-2', layout: 'ad',
                adBannerText: 'Beat the April 15 tax deadline!',
                title: 'File your<br><span style="color: #FF7A8A;">taxes free</span>',
                buttonText: 'Get the app',
                logoText: '<svg viewBox="0 0 24 24"><path fill="#E2445C" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg><div>turbotax<br><span style="font-size: 9px; font-weight: normal;">Free Edition</span></div>',
                image: 'https://placehold.co/600x300/1C1E21/1C1E21?text=W-2+Forms+Here', 
                disclaimer: '~37% of filers qualify. Simple Form 1040 returns only (no schedules, except for EITC, CTC, student loan interest, and Schedule 1-A).'
            },

            // === SPORTS ===
            {
                id: 'sports-header', layout: 'sports-scores', sectionTitle: 'Sports',
                disableSwipe: true,
                teams: [
                    { id: 'dal', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Dallas_Cowboys.svg', bgColor: '#002244' },
                    { id: 'nyy', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/NewYorkYankees_caplogo.svg/500px-NewYorkYankees_caplogo.svg.png', bgColor: '#0C2340', isCenter: true },
                    { id: 'lal', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg', bgColor: '#552583' }
                ],
                buttonText: 'Pick Your Teams',
                scores: [
                    {
                        league: 'NHL',
                        team1: { name: 'DET', score: '41-30-10', icon: '<img src="https://upload.wikimedia.org/wikipedia/en/0/03/Detroit_City_FC_logo.svg">' },
                        team2: { name: 'FLA', score: '39-38-4', icon: '<img src="https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Florida_Gators_football_logo.svg/250px-Florida_Gators_football_logo.svg.png">' },
                        time: '4/16 · 01:00'
                    },
                    {
                        league: 'MLB',
                        team1: { name: 'LAA', score: '9-9', icon: '<img src = "https://sports.cbsimg.net/fly/images/team-logos/light/301.svg">' },
                        team2: { name: 'NYY', score: '9-8', icon: '<img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/NewYorkYankees_caplogo.svg/500px-NewYorkYankees_caplogo.svg.png">' },
                        time: '4/16 · 01:05'
                    },
                    {
                        league: 'NBA',
                        team1: { name: 'GSW', score: '', icon: '<img src = "https://www.pngall.com/wp-content/uploads/13/Golden-State-Warriors-Logo.png">' },
                        team2: { name: 'LAC', score: '', icon: '<img src = "https://upload.wikimedia.org/wikipedia/en/thumb/e/ed/Los_Angeles_Clippers_%282024%29.svg/1280px-Los_Angeles_Clippers_%282024%29.svg.png">' },
                        time: '4/16 · 04:00'
                    }
                ]
            },
            {
                id: 'spo-1', layout: 'list', 
                image: 'https://imageio.forbes.com/specials-images/imageserve/68adfe41f07d0fb1351c3157/Dallas-Cowboys-quarterback-Dak-Prescott-/0x0.jpg?format=jpg&height=1093&width=1639',
                publisher: 'NFL', title: '2026 NFL mock draft 2.0: Cowboys take Rueben Bain Jr.; Steelers and Eagles select receivers',
                time: '2h ago', authors: 'Mike Band', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'spo-2', layout: 'list',
                image: 'https://s7.tvp.pl/images2/7/b/4/uid_7b4949d5413a40d8aebeda2bc8f80bac_width_1200_play_0_pos_0_gs_0_height_678_arsenal-nie-dal-szans-tottenhamowi-hotspur-fot-getty-images.jpg',
                publisher: 'Sky Sports', title: 'Arsenal 0-0 (1-0 agg.) Sporting Lisbon: Gunners back in Champions League semifinals',
                time: '3h ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'spo-3', layout: 'list',
                image: 'https://cdn.nba.com/manage/2026/04/maxey1-1536x864.jpg',
                publisher: 'NBA', title: "2026 SoFi NBA Play-In Tournament: Your guide to Wednesday's matchups",
                time: '5h ago', authors: 'Steve Aschburner', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // === FASHION ===
            {
                id: 'fash-1', layout: 'list', sectionTitle: 'Fashion', hasNewsPlusHeader: true,
                image: 'https://s.yimg.com/ny/api/res/1.2/xSj8NdHiw3ewyFntOF2wA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTE5MjA7aD0yODgwO2NmPXdIYnA-/https://media.zenfs.com/en/harpers_bazaar_391/46d1c6a0a2e25ff94aad115a17ebb0af',
                publisher: 'BAZAAR', title: "Hilary Duff's Backless Dress Solidifies Her New Fashion Era",
                time: '1d ago', authors: 'Joel Calfee',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'fash-2', layout: 'list',
                image: 'https://placehold.co/400x300/F2F2F7/8e8e93?text=Moda+Man+Closes',
                publisher: 'THE DENVER POST', title: "Downtown men's fashion retailer to close after decades in business",
                time: '8h ago', authors: '',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'fash-3', layout: 'list',
                image: 'https://static01.nyt.com/images/2026/04/15/multimedia/15FASH-WEB-harlow-vhgl/15FASH-WEB-harlow-vhgl-superJumbo.jpg?quality=75&auto=webp',
                publisher: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/NewYorkTimes.svg/1280px-NewYorkTimes.svg.png" alt="The New York Times">', 
                title: 'What Was the Deal With Jack Harlow\'s Giant Hat?',
                time: '12h ago', authors: '', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },

            // === TRAVEL ===
            {
                id: 'trav-1', layout: 'list', sectionTitle: 'Travel',
                image: 'https://www.gannett-cdn.com/authoring/authoring-images/2026/01/29/USAT/88418688007-16th-century-castle.jpg?crop=2874,2155,x0,y0',
                publisher: 'USA TODAY', title: 'Americans now need an ETA to visit the UK. What it is, how to get one',
                time: '15h ago', authors: 'Eve Chen', swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'trav-2', layout: 'list',
                image: 'https://www.nj.com/resizer/v2/XQT54P253FHV7DVMHKWLRO6YXQ.png?auth=aefcc57dbe12bf1cb6f53dfdebdf87780097e662132d9c533d46a4aaf9d6bdde&width=1280&smart=true&quality=90',
                publisher: 'nj.com', title: "U.S. issues 'reconsider travel' to Caribbean island nation in state of emergency",
                time: '18h ago', authors: '',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            },
            {
                id: 'trav-3', layout: 'list',
                image: 'https://nypost.com/wp-content/uploads/sites/2/2026/04/skyscannersoccer.jpg?resize=1024&quality=75&strip=all',
                publisher: '<img src="https://upload.wikimedia.org/wikipedia/commons/1/13/New_York_Post_logo.png" alt="NEW YORK POST">', 
                title: "Scored tickets? Use this Soccer Flight Finder to save your summer",
                time: '1d ago', authors: 'Kendall Cornish',
                swipeState: { startX: 0, startY: 0, startOffsetX: 0, offsetX: 0, isSwiping: false, isDragging: false, maxOffset: SWIPE_OFFSET_NORMAL }
            }
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