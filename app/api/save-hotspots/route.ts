import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: Request) {
  // Only allow on localhost
  const host = request.headers.get('host')
  if (!host?.includes('localhost') && !host?.includes('127.0.0.1')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { bodyParts } = await request.json()

    const componentPath = path.join(process.cwd(), 'components', 'body-diagram.tsx')
    const content = await fs.readFile(componentPath, 'utf-8')

    // Replace the bodyParts array
    const newBodyParts = `const bodyParts: BodyPart[] = ${JSON.stringify(bodyParts, null, 2)}`

    const updated = content.replace(
      /const bodyParts: BodyPart\[\] = \[[\s\S]*?\]/,
      newBodyParts
    )

    await fs.writeFile(componentPath, updated, 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
