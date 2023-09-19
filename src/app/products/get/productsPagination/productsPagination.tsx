"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

export default function ProductsPagination(props: { searchParams: any, currentPage: number | string,pages:number }) {
    console.log('props.currentPage', props.currentPage);

    const route = useRouter();
    const pageCount = props.pages;

    const [page, setPage] = useState(Number(props.currentPage) - 1);

    useEffect(() => {
        // setPage(Number(props.currentPage) - 1)
    }, []);

    function handlePageClick(v: any) {
        const { pathname } = window.location;
        const qs = Object.entries(props.searchParams)
            .filter(arr => arr[1])
            .map(arr => `${arr[0]}=${arr[1]}`)
            .join("&");
        const newLink = `${pathname.replace(/[0-9]+$/, v.selected + 1)}?${qs}`;
        route.push(newLink);
        // route.push(`/products/get/${v.selected}`);

    }
    return <>
        {page}
        <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            forcePage={page}
            pageClassName='page-item'
            nextClassName='nextClassName'
            containerClassName='pagination'
            activeLinkClassName='activeLinkClassName'
            pageLinkClassName='page-link'
            previousClassName='page-item'
            previousLinkClassName='page-link'
            nextLinkClassName='page-link'
            activeClassName='active'
        />
    </>
}
