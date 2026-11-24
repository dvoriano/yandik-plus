import {GROUPS,resolveRoute,sectionIds} from "./portal-navigation.mjs";
const $=id=>document.getElementById(id);
const nav=$("portal-nav"),title=$("portal-view-title"),toggle=$("portal-menu-toggle");
function route(move=false){
 const {group,target}=resolveRoute(location.hash);
 for(const id of sectionIds()){const panel=$(id);if(panel)panel.hidden=!group.sections.includes(id);}
 for(const a of nav.querySelectorAll("a[data-route]")){if(a.dataset.route===group.id)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");}
 title.textContent=group.label;
 if(move){const p=$(target);if(p){p.tabIndex=-1;p.focus({preventScroll:true});p.scrollIntoView({block:"start"});}}
}
for(const group of GROUPS){const a=document.createElement("a");a.href="#"+group.id;a.dataset.route=group.id;a.textContent=group.label;nav.append(a);}
toggle.addEventListener("click",()=>{const expanded=toggle.getAttribute("aria-expanded")==="true";toggle.setAttribute("aria-expanded",String(!expanded));nav.classList.toggle("menu-open",!expanded);});
nav.addEventListener("click",e=>{if(e.target.closest("a[data-route]")){toggle.setAttribute("aria-expanded","false");nav.classList.remove("menu-open");}});
window.addEventListener("hashchange",()=>route(true));
document.addEventListener("click",e=>{const a=e.target.closest("a[href]");if(!a||a.target||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;const href=a.getAttribute("href");if(href?.startsWith("#")&&href!=="#content"&&href===location.hash){route(true);}});
route(Boolean(location.hash&&location.hash!=="#content"));
