// нужен для того чтобы линтер не ругался на импорты vue файлов
declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}