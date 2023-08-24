import Quizlist from "@/pages/quiz/quizList.vue";
import QuizForm from "@/pages/quiz/quizForm.vue";
import Tag from "@/pages/tag/tagList.vue";
import QuestionList from "@/pages/question/questionsList.vue";
import Dashboard from "@/components/base/Dashboard.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

const adminRoutes = [
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path: "",
        name: "admin-dashboard",
        component: Dashboard,
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
        meta: { requiresAuth: true },
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

export default adminRoutes;
