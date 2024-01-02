import ParseGroup from './parseGroup/ParseGroup'

export default function Home() {
  return (
    <main >   
      <ParseGroup START_CATEGORY={Number(process.env.START_PAGE)} START_PAGE={Number(process.env.START_PAGE)} />
    </main>
  )
}


/*
(()=>{
    const unique = [];
    Array.from(document.querySelectorAll('.col-2>.p-1.border'))
        .forEach(({innerText})=>{
            const parentCategory = innerText
            .replace(/(#[0-9]+ )|(Категория )|(\>.+)/igm,"");
            
            if( !unique.includes(parentCategory) ) unique.push(parentCategory);
        });
    return unique;
})();
*/