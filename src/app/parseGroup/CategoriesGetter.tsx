"use client"
import main_categories from "./main_categories.json.js"

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
export default function CategoriesGetter() {
    const log = useStore($log);
    return <>
        Берем категории
        <Getter name="obuv/muzhskaya" setLog={setLog} />
        <pre>{JSON.stringify({ log, }, null, 2)}</pre>

    </>
}

function Getter(props: { name: string; setLog: any }) {
    return <button className="btn btn-sm btn-outline-dark"
        onClick={async () => {

            for (let index = 0; index < main_categories.length; index++) {
                const { link, name } = main_categories[index];

                await fetch(
                    "/api/get_categories",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            link, name
                        })
                    }
                )
                    .then(x => x.json())
                    .then(x => {
                        console.log(JSON.stringify(x, null, 2));
                        return x;
                    });


                await new Promise(resolve => {
                    setTimeout(() => {
                        resolve(1);
                    }, 1000);
                })

            }


        }}
    >берем категории</button>
}