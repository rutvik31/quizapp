import Quizlist from "@/pages/quiz/quizList.vue";
import QuizForm from "@/pages/quiz/quizForm.vue";
import Tag from "@/pages/tag/tagList.vue";
import QuestionList from "@/pages/question/questionsList.vue";
import DashBoard from "@/components/base/DashBoard.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

const adminRoutes = [
  {
    path: "/admin",
    component: DashboardLayout,
    children: [
      {
        path: "",
        name: "admin-dashboard",
        component: DashBoard,
        meta: { requiresAuth: true },
      },
      {
        path: "quiz",
        name: "admin-quiz",
        component: Quizlist,
        meta: { requiresAuth: true },
      },
      {
        path: "quizform",
        name: "admin-quizform",
        component: QuizForm,
      },
      {
        path: "tags",
        name: "admin-tags",
        component: Tag,
        meta: { requiresAuth: true },
      },
      {
        path: "questions",
        name: "admin-questions",
        component: QuestionList,
        meta: { requiresAuth: true },
      },
    ],
  },
];

export default adminRoutes