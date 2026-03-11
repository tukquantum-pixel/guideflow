"use client"

import { useState, useCallback, useRef } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import type { Activity } from "./types"
import { HeroGallery } from "./hero-gallery"
import { StatCards } from "./stat-cards"
import { SeasonBadges } from "./season-badges"
import { RouteDescription } from "./route-description"
import { StagesAccordion } from "./stages-accordion"
import { GuideCard } from "./guide-card"
import { BookingSidebar } from "./booking-sidebar"
import { GpxDownload } from "./gpx-download"
import { ElevationProfile } from "./elevation-profile"
import { SaveRouteButton } from "./save-route-button"
import { ShareRoute } from "./share-route"
import { FollowRouteButton } from "./follow-route-button"
import { CheckIcon, PinIcon, MapIcon } from "@/components/icons"

const RouteMap = dynamic(() => import("./route-map").then(m => ({ default: m.RouteMap })), {
    ssr: false, loading: () => <div className="bg-white border border-roca-dark/15 rounded-xl h-[400px] flex items-center justify-center text-granito gap-2"><MapIcon className="w-5 h-5" /> Cargando mapa...</div>,
})

export function RouteDetail({ activity: a }: { activity: Activity }) {
    const allCheckpoints = a.track?.stages.flatMap(s => s.checkpoints) || []
    const mapInstanceRef = useRef<any>(null)
    const coordsRef = useRef<number[][]>([])
    const markerRef = useRef<any>(null)
    const leafletRef = useRef<any>(null)

    const handleMapReady = useCallback((map: any, coords: number[][], leaflet: any) => {
        mapInstanceRef.current = map
        coordsRef.current = coords
        leafletRef.current = leaflet
    }, [])

    const handleElevationHover = useCallback((index: number | null) => {
        const map = mapInstanceRef.current
        const Lf = leafletRef.current
        if (!map || !Lf) return

        if (markerRef.current) { markerRef.current.remove(); markerRef.current = null }

        if (index !== null && coordsRef.current[index]) {
            const c = coordsRef.current[index]
            const ele = c[2] ? `${Math.round(c[2])}m` : ""
            markerRef.current = Lf.marker([c[1], c[0]], {
                icon: Lf.divIcon({
                    html: `<div style="width:14px;height:14px;background:#f97316;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
                    className: "bg-transparent border-none", iconSize: [14, 14], iconAnchor: [7, 7],
                }),
            }).addTo(map)
            if (ele) markerRef.current.bindTooltip(ele, { permanent: true, direction: "top", offset: [0, -10] }).openTooltip()
        }
    }, [])

    return (
        <div className="min-h-screen bg-niebla">
            <nav className="bg-pizarra text-white py-3">
                <div className="max-w-6xl mx-auto px-4 flex items-center gap-4">
                    <Link href="/explorar" className="text-musgo-light hover:text-white transition font-medium">← Explorar</Link>
                    <span className="text-white/20">|</span>
                    <span className="text-sm text-white/60">{a.category}</span>
                </div>
            </nav>

            <HeroGallery photos={a.photos} title={a.title} difficulty={a.difficulty} category={a.category} />

            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl md:text-4xl font-bold text-pizarra leading-tight">{a.title}</h1>
                <div className="flex items-center gap-3 mt-3 text-sm text-granito flex-wrap">
                    <Link href={`/${a.guide.slug}`} className="flex items-center gap-1.5 hover:text-musgo transition font-medium">
                        <div className="w-6 h-6 rounded-full bg-musgo/10 overflow-hidden">
                            {a.guide.avatarUrl ? <img src={a.guide.avatarUrl} className="w-full h-full object-cover" alt="" /> :
                                <span className="flex items-center justify-center h-full text-xs font-bold text-musgo">{a.guide.name[0]}</span>}
                        </div>
                        {a.guide.name} {a.guide.verificationLevel === "VERIFIED" && <CheckIcon className="w-4 h-4 inline text-musgo" />}
                    </Link>
                    {a.track?.routeType && <span className="px-2.5 py-0.5 rounded-full text-xs bg-pizarra/10 font-medium">{a.track.routeType}</span>}
                    {a.meetingPoint && <span className="flex items-center gap-1"><PinIcon className="w-3.5 h-3.5" /> {a.meetingPoint}</span>}
                    <SaveRouteButton activityId={a.id} />
                </div>
                {a.track?.seasonRecommended && <SeasonBadges seasons={a.track.seasonRecommended} />}
                <StatCards track={a.track} durationMinutes={a.durationMinutes} />
            </div>

            <main className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {a.track?.geojson && (
                        <>
                            <RouteMap geojson={a.track.geojson} checkpoints={allCheckpoints} meetingLat={a.meetingLat} meetingLng={a.meetingLng} onMapReady={handleMapReady} />
                            <ElevationProfile geojson={a.track.geojson} onHover={handleElevationHover} />
                        </>
                    )}
                    <RouteDescription description={a.description} includes={a.includes} whatToBring={a.whatToBring} />
                    {a.track && a.track.stages.length > 0 && <StagesAccordion stages={a.track.stages} />}
                </div>
                <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                    {a.track && <FollowRouteButton activityId={a.id} isPremium={false} />}
                    <BookingSidebar activity={a} />
                    <GuideCard guide={a.guide} />
                    {a.track && <GpxDownload activityId={a.id} />}
                    <ShareRoute title={a.title} activityId={a.id} />
                </div>
            </main>
        </div>
    )
}
