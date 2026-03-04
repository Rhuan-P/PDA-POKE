import { createRouter, createWebHistory } from 'vue-router'
import SelectionView from '../ui/views/SelectionView.vue'
import BattleView from '../ui/views/BattleView.vue'

const routes = [
  {
    path: '/',
    redirect: '/selection'
  },
  {
    path: '/selection',
    name: 'Selection',
    component: SelectionView,
    meta: {
      title: 'Seleção de Pokémon'
    }
  },
  {
    path: '/battle',
    name: 'Battle',
    component: BattleView,
    meta: {
      title: 'Arena de Batalha'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard para atualizar título da página
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Pokémon Battle Simulator`
  }
  next()
})

export default router
