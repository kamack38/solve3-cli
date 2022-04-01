declare module 'pdf2html' {
    import type { PathLike } from 'node:fs'
    export const html: (filePath: PathLike, callback: (err: Error, res: string) => void) => void
    export const text: (filePath: PathLike, callback: (err: Error, res: string) => void) => void
    export const pages: (filePath: PathLike, callback: (err: Error, res: string) => void) => void
    export const meta: (filePath: PathLike, callback: (err: Error, res: string) => void) => void
    export const thumbnail: (
        filePath: PathLike,
        options: { page: number; imageType: 'png' | 'jpg'; width: number; height: number } | ((err: Error, res: string) => void),
        callback?: (err: Error, res: string) => void,
    ) => void
}
