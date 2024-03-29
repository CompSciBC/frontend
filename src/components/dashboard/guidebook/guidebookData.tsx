import { server } from '../../..';
import {
  GuidebookDto,
  GuidebookImage,
  GuidebookImageFiles
} from '../../../utils/dtos';

/**
 * Fetches the guidebook content for the identified property
 *
 * @param propId A property id
 * @returns A GuidebookDto promise
 */
export const getGuidebookContent = async (
  propId: string
): Promise<GuidebookDto> => {
  const response = await fetch(`${server}/api/guidebook/${propId}/content`);
  return await response.json();
};

/**
 * Fetches the images for the identified property
 *
 * @param propId A property id
 * @returns A promise for an array of guidebook images
 */
export const getGuidebookImages = async (
  propId: string,
  dimensions?: { width: number; height: number }
): Promise<GuidebookImage[]> => {
  const response = await fetch(
    `${server}/api/guidebook/${propId}/images${
      dimensions ? `?dimensions=${dimensions.width}x${dimensions.height}` : ''
    }`
  );

  return await response.json();
};

/**
 * Saves the given guidebook to the API under the given property id
 *
 * @param propId A property id
 * @param guidebook A guidebook DTO
 * @returns True if the save was successful, or false otherwise
 */
export const uploadGuidebookContent = async (
  propId: string,
  guidebook: GuidebookDto
): Promise<boolean> => {
  const response = await fetch(`${server}/api/guidebook/${propId}/content`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(guidebook)
  });
  return (await response.text()) === 'Saved JSON file to S3';
};

/**
 * Saves the given form data to the API under the given property id
 *
 * @param propId A property id
 * @param imageFiles A list of files
 * @returns A promise for an array of guidebook images
 */
export const uploadGuidebookImages = async (
  propId: string,
  imageFiles: GuidebookImageFiles
): Promise<GuidebookImage[]> => {
  const { files, metadata } = imageFiles;
  const body = new FormData();

  Array.from(files).forEach((file) => body.append('files', file));
  body.append('metadata', JSON.stringify(metadata));

  const response = await fetch(`${server}/api/guidebook/${propId}/images`, {
    method: 'POST',
    // no need to set content-type: 'multipart/form-data' header. Browser will set content-type
    // and boundary automatically
    // https://stackoverflow.com/questions/36005436/the-request-was-rejected-because-no-multipart-boundary-was-found-in-springboot
    body
  });
  return await response.json();
};

/**
 * Deletes the image with the given src attribute
 *
 * @param src The src attribute of an image
 * @returns True if the deletion was successful, or false otherwise
 */
export const deleteGuidebookImage = async (src: string): Promise<boolean> => {
  const response = await fetch(`${server}/api/guidebook/images?url=${src}`, {
    method: 'DELETE'
  });
  return response.status === 204;
};
