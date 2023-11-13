import { useEffect, useState } from "react"
import { CampaignForm } from "../create-campaign-form/campaign-form"
import { Button } from "../ui/button"
import CampaignsListings from "../campaign-listings/campaign-listings"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Shell } from "lucide-react"

const Campaign = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isWatchOnly, setIsWatchOnly] = useState(false)
    const [selectedCampId, setSelectedCampId] = useState<undefined | string>()
    const [IsToggled, setIsToggled] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (searchParams.get("createMode")) {
            setIsToggled(true)
        }
        if (searchParams.get('isWatchOnly')) {
            setIsWatchOnly(true)
        } else {
            setIsWatchOnly(false)
        }
        if (searchParams.get('campId')) {
            console.log(searchParams.get('campId'))
            setSelectedCampId(String(searchParams.get('campId')))
        } else {
            setSelectedCampId(undefined)
        }
    }, [searchParams, IsToggled])
    return <>

        <div className="flex w-full h-20 bg-purple-600">
            <div className="flex items-center m-2 gap-1"><Shell /> <div className="text-lg font-semibold">CampMan</div></div>
            <div className="flex items-end mb-4 justify-end w-full">
                <Button variant={'secondary'}
                    onClick={() => {
                        if (IsToggled) {
                            setIsToggled(false)
                            navigate('/')
                        } else {
                            setIsToggled(true)
                        }
                    }}
                    className='bg-white hover:bg-black hover:text-white  mr-3'>{IsToggled ? selectedCampId ? "Back" : "Cancel" : "Add a Campaign"}</Button>
            </div>
        </div>
        <div className="justify-center flex mt-9">
            {
                IsToggled ?
                    <CampaignForm campname={selectedCampId} isWatchOnly={isWatchOnly} campId={selectedCampId} setIsToggled={setIsToggled}></CampaignForm> : <CampaignsListings></CampaignsListings>
            }
        </div>
        <div>
        </div>
    </>
}

export { Campaign }