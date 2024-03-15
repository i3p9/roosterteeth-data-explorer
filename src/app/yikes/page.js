async function getData() {
    const res = await fetch(`https://archive.org/advancedsearch.php?q=uploader%3A%22sphincone%40gmail.com%22+AND+creator%3A%28letsplay+OR+achievementhunter%29+AND+NOT+format%3A%28MP4+OR+h.264+OR+webm%29&fl%5B%5D=identifier&sort%5B%5D=&sort%5B%5D=&sort%5B%5D=&rows=5000&page=1&output=json&callback=callback&save=yes`);

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    const data = await res.text();
    const jsonStr = data.replace(/^callback\(|\)$/g, '');
    const json = JSON.parse(jsonStr);

    const numFound = json.response.numFound;

    return numFound
}

export default async function Page() {
    const data = await getData()

    return <main>
        <div className="container mx-auto my-5">
            <p>issues with upload: 3371</p>
            <p>remaining: {data}</p>
            {parseInt(data) &&
                <p>fixed: {3371 - parseInt(data)}</p>
            }

        </div>
    </main>
}
