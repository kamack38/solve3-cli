declare module 'pdf2html' {
    import type { PathLike } from 'node:fs'
    type callback = (err: Error, res: string) => void
    export const html: (filePath: PathLike, callback: callback) => void
    export const text: (filePath: PathLike, callback: callback) => void
    export const pages: ((filePath: PathLike, callback: callback) => void) | ((filePath: PathLike, options: { text: boolean }, callback: callback) => void)
    export const meta: (filePath: PathLike, callback: callback) => void
    export const thumbnail: (
        filePath: PathLike,
        options: { page: number; imageType: 'png' | 'jpg'; width: number; height: number } | callback,
        callback?: (err: Error, res: string) => void,
    ) => void
}
