"use client"

import { ActivityForm } from "@/components/activity-form"

export function CreateActivityForm({ onDone }: { onDone: () => void }) {
    return <ActivityForm mode="create" onDone={onDone} />
}
