const { createApp, ref, onMounted, onUnmounted } = Vue;

createApp({
    setup() {
        // Реактивные переменные
        const currentTime = ref('');
        const currentDate = ref(''); // <--- Новая переменная для даты
        const currentTab = ref('today');

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
                authors: 'Courtney Kube, Mosheh Gains, Pat...'
            }
        ]);

        // Функция обновления времени
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            currentTime.value = `${hours}:${minutes}`;
        };

        // <--- Новая функция обновления даты
        const updateDate = () => {
            const now = new Date();
            // Форматируем дату как "Месяц День" (например, "April 4")
            const options = { month: 'long', day: 'numeric' };
            currentDate.value = now.toLocaleDateString('en-US', options);
        };

        let timer;
        onMounted(() => {
            updateTime();
            updateDate(); // <--- Вызываем форматирование даты при загрузке
            timer = setInterval(updateTime, 1000);
        });

        onUnmounted(() => {
            clearInterval(timer);
        });

        const getIconStyle = (shape) => {
            const svg = shape === 'rect' 
                ? `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' rx='4' fill='black'/></svg>`
                : `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='black'/></svg>`;
            const url = `url("data:image/svg+xml;utf8,${svg}")`;
            return {
                maskImage: url,
                WebkitMaskImage: url
            };
        };

        return {
            currentTime,
            currentDate, // <--- Не забываем вернуть переменную, чтобы HTML ее увидел
            currentTab,
            tabs,
            topStories,
            getIconStyle
        };
    }
}).mount('#app');