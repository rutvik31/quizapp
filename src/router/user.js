import UserLayout from "@/layouts/UserLayout.vue";
import UserDashboard from "@/components/base/UserDashboard.vue";
import UserQuizList from "@/pages/user/userQuizList.vue";
import QuizDetails from "@/pages/user/quizDetail.vue";
import QuizScore from "@/pages/user/quizScore.vue";

const userRoutes = [
  {
    path: "/user",
    component: UserLayout,
    children: [
      {
        path: "",
        name: "user-dashboard",
        component: UserDashboard,
        meta: { requiresAuth: true },
      },
      {
        path: "quiz",
        name: "user-quiz",
        component: UserQuizList,
        meta: { requiresAuth: true },
      },
      {
        path: "quiz/:id",
        name: "user-quiz-detail",
        component: QuizDetails,
        meta: { requiresAuth: true },
      },
      {
        path: "result",
        name: "user-result",
        component: QuizScore,
        meta: { requiresAuth: true },
      },
    ],
  },
];

export default userRoutes;
