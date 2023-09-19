"use client"
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = any;

export default function ProductsFilter(props: { columns: string[], searchParams: any }) {

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    defaultValues: props.searchParams
  });
  const route = useRouter();

  const onSubmit: SubmitHandler<Inputs> = data => {
    const { pathname } = window.location;
    const qs = Object.entries(data)
      .filter(arr => arr[1])
      .map(arr => `${arr[0]}=${arr[1]}`)
      .join("&");
    const newLink = `${pathname.replace(/[0-9]+$/, "1")}?${qs}`;
    route.push(newLink);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="d-flex flex-wrap">
        {props.columns.map(column => <div className="" key={column}>
          <div>{column}</div>
          <input {...register(column)} />
        </div>)}
      </div>
      <input type="submit" />
    </form>
  );
}