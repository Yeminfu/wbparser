"use client"

import { createEvent, createStore } from "effector";
import { useStore } from "effector-react";
const setLog = createEvent<any>();
const $log = createStore<any>([])
    .on(setLog, (store: any, newData: any) => {
        return [
            newData,
            ...store
        ]
    });
export default function ProductsGetter() {
    const log = useStore($log);
    return <>
        <Getter name="obuv/muzhskaya" setLog={setLog} />
        <pre>{JSON.stringify(log, null, 2)}</pre>

    </>
}

function Getter(props: { name: string; setLog: any }) {
    return <button className="btn btn-sm btn-outline-dark"
        onClick={async () => {
            let page = 1;
            while (true) {
                await fetch(
                    "/api/categories/parse",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            link: `https://www.wildberries.ru/catalog/${props.name}?sort=popular&page=${page++}`
                        })
                    }
                )
                    .then(x => x.json())
                    .then(x => {
                        setLog(x?.products?.length)
                        return x;
                    })
                // break;
            }
        }}
    >{props.name}</button>
}