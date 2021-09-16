function getFavicon(){
    let el: NodeListOf<HTMLLinkElement> = document.querySelectorAll('link') as NodeListOf<HTMLLinkElement>
    for(let i=0;i<el.length;i++){
        if(el[i].rel === "icon"){
            return el[i].href
        }
    }
}
async function snackbar(text:string,delay:number,callback: (delay: number)=> void){
    let snackbar = document.createElement('div')
    snackbar.classList.add(`wds-snackbar`)
    snackbar.textContent = "Favicon ajouté avec success !"
    document.body.appendChild(snackbar)
    callback(delay)
}
chrome.runtime.sendMessage({
    message: "getFavicon",
    payload: getFavicon
},response => {
    if(response === "getFavicon_success"){
        snackbar(response.payload,2000,(delay)=>{
            setTimeout(()=>{
                let snackbar = document.querySelector('.wds-snackbar')
                snackbar.classList.remove('wds-show')
                snackbar.classList.remove('wds-close')
            },delay)
        })
    }
})