import ParseGroup from './parseGroup/ParseGroup'

export default function Home() {
  return (
    <main >
      <ParseGroup START_CATEGORY={Number(process.env.START_PAGE)} START_PAGE={Number(process.env.START_PAGE)} />
    </main>
  )
}
