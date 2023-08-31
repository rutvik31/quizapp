import UserLayout from "@/layouts/UserLayout.vue";
import UserQuizList from "@/pages/user/userQuizList.vue";
import QuizDetails from "@/pages/user/quizDetail.vue";

const userRoutes = [
  {
    path: "/user",
    component: UserLayout,
    children: [
      {
        path: "",
        name: "user-dashboard",
        component: UserQuizList,
        meta: { requiresAuth: true },
      },
      {
        path: "quiz/:id",
        name: "user-quiz-detail",
        component: QuizDetails,
        meta: { requiresAuth: true },
      },
    ],
  },
];

export default userRoutes;
