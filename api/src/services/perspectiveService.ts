import type { Canvas, CanvasRenderingContext2D, Image } from 'canvas';

type PerspectiveImage = Canvas | Image;

export interface Point {
    x: number;
    y: number;
}

export interface PerspectiveCorners {
    topLeft: Point;
    topRight: Point;
    bottomLeft: Point;
    bottomRight: Point;
}

export interface PerspectiveOptions {
    subdivisions?: number;
}

export function drawPerspectiveImage(ctx: CanvasRenderingContext2D, image: PerspectiveImage, corners: PerspectiveCorners, options: PerspectiveOptions = {}): void {

    const subdivisions = Math.max(1, Math.floor(options.subdivisions ?? 32));

    const { width, height } = getImageSize(image);

    if (width <= 0 || height <= 0) {
        throw new Error("Invalid image dimensions");
    }

    const homography = createHomography(
        [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 1 }
        ],
        [
            corners.topLeft,
            corners.topRight,
            corners.bottomRight,
            corners.bottomLeft
        ]
    );

    const grid: Point[][] = [];

    for (let y = 0; y <= subdivisions; y++) {
        const row: Point[] = [];
        const v = y / subdivisions;
        for (let x = 0; x <= subdivisions; x++) {
            const u = x / subdivisions;
            row.push(applyHomography(homography, u, v));
        }
        grid.push(row);
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(corners.topLeft.x, corners.topLeft.y);
    ctx.lineTo(corners.topRight.x, corners.topRight.y);
    ctx.lineTo(corners.bottomRight.x, corners.bottomRight.y);
    ctx.lineTo(corners.bottomLeft.x, corners.bottomLeft.y);
    ctx.closePath();
    ctx.clip();
    ctx.imageSmoothingEnabled = true;

    for (let y = 0; y < subdivisions; y++) {
        for (let x = 0; x < subdivisions; x++) {
            const x0 = x / subdivisions;
            const x1 = (x + 1) / subdivisions;

            const y0 = y / subdivisions;
            const y1 = (y + 1) / subdivisions;

            const sx0 = x0 * width;
            const sx1 = x1 * width;

            const sy0 = y0 * height;
            const sy1 = y1 * height;

            const A = grid[y][x];
            const B = grid[y][x + 1];
            const C = grid[y + 1][x + 1];
            const D = grid[y + 1][x];

            drawTriangle(ctx, image, {x: sx0, y: sy0}, {x: sx1, y: sy0}, {x: sx1, y: sy1}, A, B, C);
            drawTriangle(ctx, image, {x: sx0, y: sy0}, {x: sx1, y: sy1}, {x: sx0, y: sy1}, A, C, D);

        }
    }

    ctx.restore();

}

function getImageSize(image: PerspectiveImage): { width: number, height: number } {
    const imageDimensions = image as {
        width?: number;
        height?: number;
        naturalWidth?: number;
        naturalHeight?: number;
    };
    const width = imageDimensions.naturalWidth || imageDimensions.width || 0;
    const height = imageDimensions.naturalHeight || imageDimensions.height || 0;

    if (width <= 0 || height <= 0) {
        throw new Error("Unsupported image type or invalid image dimensions");
    }

    return { width, height };
}

function drawTriangle(ctx: CanvasRenderingContext2D, image: PerspectiveImage, s0: Point, s1: Point, s2: Point, d0: Point, d1: Point, d2: Point): void {
    const transform = triangleAffineTransform(s0, s1, s2, d0, d1, d2);
    const center = {
        x: (s0.x + s1.x + s2.x) / 3,
        y: (s0.y + s1.y + s2.y) / 3,
    };
    const overlap = 1;
    const expandedSourcePoints = [s0, s1, s2].map(point => {
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        const distance = Math.hypot(dx, dy);
        return {
            x: point.x + dx / distance * overlap,
            y: point.y + dy / distance * overlap,
        };
    });

    ctx.save();

    ctx.setTransform(transform.a, transform.b, transform.c, transform.d, transform.e, transform.f);
    ctx.beginPath();
    ctx.moveTo(expandedSourcePoints[0].x, expandedSourcePoints[0].y);
    ctx.lineTo(expandedSourcePoints[1].x, expandedSourcePoints[1].y);
    ctx.lineTo(expandedSourcePoints[2].x, expandedSourcePoints[2].y);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(image, 0, 0);
    ctx.restore();
}

interface AffineTransform {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
}

function triangleAffineTransform(s0: Point, s1: Point, s2: Point, d0: Point, d1: Point, d2: Point): AffineTransform {
    const dx1 = s1.x - s0.x;
    const dy1 = s1.y - s0.y;
    const dx2 = s2.x - s0.x;
    const dy2 = s2.y - s0.y;

    const determinant = dx1 * dy2 - dx2 * dy1;

    if (Math.abs(determinant) < 1e-12) {
        throw new Error("Source triangle is degenerate");
    }

    const du1 = d1.x - d0.x;
    const dv1 = d1.y - d0.y;
    const du2 = d2.x - d0.x;
    const dv2 = d2.y - d0.y;

    const a = (du1 * dy2 - du2 * dy1) / determinant;
    const b = (dv1 * dy2 - dv2 * dy1) / determinant;
    const c = (du2 * dx1 - du1 * dx2) / determinant;
    const d = (dv2 * dx1 - dv1 * dx2) / determinant;
    const e = d0.x - a * s0.x - c * s0.y;
    const f = d0.y - b * s0.x - d * s0.y;

    return { a, b, c, d, e, f };
}

interface Homography {
    h11: number;
    h12: number;
    h13: number;
    h21: number;
    h22: number;
    h23: number;
    h31: number;
    h32: number;
}

function createHomography(src: Point[], dst: Point[]): Homography {
    if (src.length !== 4 || dst.length !== 4) {
        throw new Error("Source and destination points must be arrays of 4 points");
    }

    const matrix: number[][] = [];

    for (let i = 0; i < 4; i++) {
        const x = src[i].x;
        const y = src[i].y;
        const u = dst[i].x;
        const v = dst[i].y;

        matrix.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
        matrix.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
    }

    const solution = solveLinearSystem(matrix);

    return {
        h11: solution[0],
        h12: solution[1],
        h13: solution[2],
        h21: solution[3],
        h22: solution[4],
        h23: solution[5],
        h31: solution[6],
        h32: solution[7],
    };
}

function applyHomography(h: Homography, x: number, y: number): Point {
    const denominator = h.h31 * x + h.h32 * y + 1;

    if (Math.abs(denominator) < 1e-12) {
        throw new Error("Homography results in division by zero");
    }

    return {
        x: (h.h11 * x + h.h12 * y + h.h13) / denominator,
        y: (h.h21 * x + h.h22 * y + h.h23) / denominator,
    };
}

function solveLinearSystem(matrix: number[][]): number[] {
    const n = matrix.length;

    const a = matrix.map(row => [...row]);

    for(let column = 0; column < n; column++) {
        let pivot = column;

        for (let row = column + 1; row < n; row++) {
            if (Math.abs(a[row][column]) > Math.abs(a[pivot][column])) {
                pivot = row;
            }
        }

        if (Math.abs(a[pivot][column]) < 1e-12) {
            throw new Error("Matrix is singular or nearly singular");
        }

        if (pivot !== column) {
            [a[column], a[pivot]] = [a[pivot], a[column]];
        }

        const pivotValue = a[column][column];

        for (let j = column; j <= n; j++) {
            a[column][j] /= pivotValue;
        }

        for (let row = 0; row < n; row++) {
            if (row == column) continue;

            const factor = a[row][column];

            if (factor == 0) continue;

            for (let j = column; j <= n; j++) {
                a[row][j] -= factor * a[column][j];
            }
        }
    }

    return a.map(row => row[n]);
}
