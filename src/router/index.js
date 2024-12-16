import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login/Login.vue';
import DashBoard from '../views/DashBoard/DashBoard.vue';
import Notice from '../views/Board/Notice.vue';

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login,
    },
    {
        path: '/vue',
        name: 'vue',
        component: DashBoard,
        children: [
            {
                path: 'board',
                name: 'board',
                children: [
                    {
                        // notice.do -> localhost:5173/board/notice.do
                        // /notice.do -> localhost:5173/notice.do
                        path: 'notice.do',
                        name: 'notice',
                        component: Notice,
                    }
                ]
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});

export default router;
