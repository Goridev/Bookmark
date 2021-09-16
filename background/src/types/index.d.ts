type Sort = "alphabet" | "category" | "none" | undefined

type ACTION = "add"|"remove"|"update"

interface IBookmark extends chrome.bookmarks.BookmarkTreeNode{
    category?: string,
    type?: "tree" | "element",
    level?: number,
    favicon?: string
}
type Snackbar = {
    active: boolean,
    message: string
}
type Modal = {
    id:string,
    active: boolean,
    response: boolean | null | string,
    content?:{
        title: string,
        message: string
    },
    title:string
    action: "remove"|"update"|"prompt"|null,
}
declare class iBookmark{
    constructor()
    private main: IBookmark[]
    private currentTab: chrome.tabs.Tab
    getCurrentTab(): Promise<chrome.tabs.Tab>
    setCurrentTab(newTab: chrome.tabs.Tab): Promise<void>
    getMain(): Promise<IBookmark[]>
    setMain(newMain: IBookmark[]): Promise<void>
}