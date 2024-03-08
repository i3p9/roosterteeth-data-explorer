import masterList from '../master.json'

export const getShowInfo = async (uuid) => {
    const result = masterList.data.filter((show) => show.uuid === uuid)
    return result
}
