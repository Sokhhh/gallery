/**
 * @swagger
 * /api/galleries/{galleryId}/images/{imageId}/comments:
 *   post:
 *     summary: Create a new comment for a specific image
 *     tags: [Comments]
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
 *               content:
 *                 type: string
 *                 example: "This is a great image!"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 image_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 content:
 *                   type: string
 *       422:
 *         description: Invalid content
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/galleries/{galleryId}/images/{imageId}/comments:
 *   get:
 *     summary: Get all comments for a specific image
 *     tags: [Comments]
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
 *         description: A list of comments for the image
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   image_id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   content:
 *                     type: string
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/galleries/{galleryId}/images/{imageId}/comments/{commentId}:
 *   get:
 *     summary: Get a specific comment by ID
 *     tags: [Comments]
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
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: The ID of the comment
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 image_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 content:
 *                   type: string
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/galleries/{galleryId}/images/{imageId}/comments/{commentId}:
 *   put:
 *     summary: Update a specific comment
 *     tags: [Comments]
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
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: The ID of the comment
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated comment content."
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 image_id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 content:
 *                   type: string
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/galleries/{galleryId}/images/{imageId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a specific comment
 *     tags: [Comments]
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
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: The ID of the comment
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
