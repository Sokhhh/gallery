// swaggerImages.js

/**
 * @swagger
 * /api/galleries/{galleryId}/images:
 *   post:
 *     summary: Create a new image in a specific gallery
 *     tags: [Images]
 *     parameters:
 *       - name: galleryId
 *         in: path
 *         required: true
 *         description: The ID of the gallery
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "http://example.com/image.jpg"
 *               title:
 *                 type: string
 *                 example: "Beautiful Sunset"
 *     responses:
 *       201:
 *         description: Image created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 url:
 *                   type: string
 *                 title:
 *                   type: string
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/galleries/{galleryId}/images:
 *   get:
 *     summary: Get all images for a specific gallery
 *     tags: [Images]
 *     parameters:
 *       - name: galleryId
 *         in: path
 *         required: true
 *         description: The ID of the gallery
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of images for the gallery
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   url:
 *                     type: string
 *                   title:
 *                     type: string
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/galleries/{galleryId}/images/{imageId}:
 *   get:
 *     summary: Get a specific image
 *     tags: [Images]
 *     parameters:
 *       - name: galleryId
 *         in: path
 *         required: true
 *         description: The ID of the gallery
 *         schema:
 *           type: integer
 *       - name: imageId
 *         in: path
 *         required: true
 *         description: The ID of the image
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Image found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 url:
 *                   type: string
 *                 title:
 *                   type: string
 *       404:
 *         description: Image not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/galleries/{galleryId}/images/{imageId}:
 *   put:
 *     summary: Update a specific image
 *     tags: [Images]
 *     parameters:
 *       - name: galleryId
 *         in: path
 *         required: true
 *         description: The ID of the gallery
 *         schema:
 *           type: integer
 *       - name: imageId
 *         in: path
 *         required: true
 *         description: The ID of the image
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "http://example.com/image_updated.jpg"
 *               title:
 *                 type: string
 *                 example: "Updated Title"
 *     responses:
 *       200:
 *         description: Image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 url:
 *                   type: string
 *                 title:
 *                   type: string
 *       404:
 *         description: Image not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/galleries/{galleryId}/images/{imageId}:
 *   delete:
 *     summary: Delete a specific image
 *     tags: [Images]
 *     parameters:
 *       - name: galleryId
 *         in: path
 *         required: true
 *         description: The ID of the gallery
 *         schema:
 *           type: integer
 *       - name: imageId
 *         in: path
 *         required: true
 *         description: The ID of the image
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Image not found
 *       500:
 *         description: Internal server error
 */