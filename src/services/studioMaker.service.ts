'use client';

import { studioMakerApi } from './apis.service';
import { StartPoint } from '../lib/interfaces/startPoint.interface';
import { Journey } from '@/lib/interfaces/journey.interface';
import { Trail } from '@/lib/interfaces/trails.interface';
import { Content } from '@/lib/interfaces/content.interface';
import { Subject } from '@/lib/interfaces/subjetc.interface'
import { Knowledge } from '@/lib/interfaces/knowledge.interface';
import { ErrorRounded } from '@mui/icons-material';


export const getStartPoints = async (): Promise<StartPoint[]> => {
  try {
    const response = await studioMakerApi.get('/points');
    console.log('Start Points:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Start Points:', error);
    throw error;
  }
};

export const getStartPointsByUser = async (
  id: string,
): Promise<StartPoint[]> => {
  try {
    const response = await studioMakerApi.get(`/points/user/${id}`);
    console.log('Journeys:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch start points:', error);
    throw error;
  }
};

export const createStartPoint = async ({
  data,
  token,
}: {
  data: any;
  token: string;
}) => {
  try {
    console.log(data);
    const response = await studioMakerApi.post('/points', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Start point created:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to create start point:', error);
    return { error: error };
  }
};

export const updateStartPointById = async ({
  id,
  data,
  token,
}: {
  id: string;
  data: any;
  token: string;
}) => {
  try {
    const response = await studioMakerApi.put(`/points/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Start point updated:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to update start point:', error);
    return { error: error };
  }
};

export const deleteStartPoint = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}) => {
  try {
    const response = await studioMakerApi.delete(`/points/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Start point deleted:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to delete start points:', error);
    return { error: error };
  }
};

export const GetKnowledge = async (): Promise<Knowledge[]> => {
  try {
    const response = await studioMakerApi.get('/knowledges', {});
    return response.data;
  } catch (error) {
    console.error("Erro ao fetch knowledge", error);
    throw error
  }
}
export const GetKnowledgesByUserId = async (id: string): Promise<Knowledge[]> => {
  try {
    const response = await studioMakerApi.get(`/knowledges/users/${id}`, {
    });
    console.log("Knowledge:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Knowledge", error);
    throw error;
  }
}
export const createKnowledges = async ({
  data,
  token,
}: {
  data: any;
  token: string;
}) => {
  try {
    console.log(data);
    const response = await studioMakerApi.post('/Knowledges', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('knowledges created:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to create knowledges:', error);
    return { error: error };
  }
};
export const updateKnowledgeById = async ({
  id,
  data,
  token,
}: {
  id: string;
  data: any;
  token: string;
}) => {
  try {
    const response = await studioMakerApi.patch(`/knowledges/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Knowledges updated:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to update Knowledges:', error);
    return { error: error };
  }
};

export const deleteKnowledge = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}) => {
  try {
    const response = await studioMakerApi.delete(`/Knowledges/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Knowledges deleted:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to delete Knowledges:', error);
    return { error: error };
  }
};
export const updateKnowledgesOrder = async (
  updatedKnowledge: Knowledge[],
): Promise<any> => {
  try {
    const response = await studioMakerApi.patch(
      '/Knowledges/order',
      {
        knowledge: updatedKnowledge
      },
    );
    console.log('Knowledge updated:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to update Knowledge:', error);
    return { error: error };
  }
};


export const GetSubjectsByKnowledgesId = async (id: string): Promise<Subject[]> => {
  try {
    const response = await studioMakerApi.get(`/knowledges/${id}/subjects`, {

    });
    return response.data.subjects;
  } catch (error) {
    console.error("falha ao buscar disciplinas pelo ID da area do conhecimento", error);
    throw error;
  }
}

export const GetSubjects = async (): Promise<Subject[]> => {
  try {
    const response = await studioMakerApi.get('/subjects', {
    });
    console.log("Subjects:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Subjects erro aqui animal", error);
    throw error;
  }

}

export const GetSubjectsByUserId = async (id: string): Promise<Subject[]> => {
  try {
    const response = await studioMakerApi.get(`/subjects/users/${id}`, {
    });
    console.log("Subjects:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Subjects", error);
    throw error;
  }

}
export const createSubject = async ({
  data,
  token,
}: {
  data: any;
  token: string;
}) => {
  try {
    console.log(data);
    const response = await studioMakerApi.post('/subjects', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('subjects created:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to create subjects:', error);
    return { error: error };
  }
};
export const updateSubjectById = async ({
  id,
  data,
  token,
}: {
  id: string;
  data: any;
  token: string;
}) => {
  try {
    const response = await studioMakerApi.patch(`/subjects/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('subjects updated:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to update subjects:', error);
    return { error: error };
  }
};

export const updateSubjectOrder = async (
  updatedSubjects: Subject[],
): Promise<any> => {
  try {
    const response = await studioMakerApi.patch(
      '/subject/order',
      {
        subject: updatedSubjects
      },
    );
    console.log('Journeys updated:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to update Subject:', error);
    return { error: error };
  }
};


export const deleteSubjects = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}) => {
  try {
    const response = await studioMakerApi.delete(`/subjects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('subjects deleted:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to delete subjects:', error);
    return { error: error };
  }
};

export const getJourneys = async (): Promise<Journey[]> => {
  try {
    const response = await studioMakerApi.get('/journeys', {
    });
    console.log('Journeys:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch journey:', error);
    throw error;
  }
};

export const getJourneysByPoint = async (id: string): Promise<Journey[]> => {
  try {
    const response = await studioMakerApi.get(`/journeys/subjects/${id}`, {
    });
    console.log('Journeys:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

export const createJourney = async ({
  data,
  token,
}: {
  data: any;
  token: string;
}) => {
  try {
    console.log(data);
    const response = await studioMakerApi.post('/journeys', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Journey created:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to create journey:', error);
    return { error: error };
  }
};

export const updateJourneyById = async ({
  id,
  data,
  token,
}: {
  id: string;
  data: any;
  token: string;
}) => {
  try {
    const response = await studioMakerApi.put(`/journeys/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Journey updated:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to update journey:', error);
    return { error: error };
  }
};

export const deleteJourney = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}) => {
  try {
    const response = await studioMakerApi.delete(`/journeys/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Journey deleted:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to delete journey:', error);
    return { error: error };
  }
};

export const getTrails = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<Trail[]> => {
  console.log(id, token);
  try {
    const response = await studioMakerApi.get(`/trails/journey/${id}`, {
    });
    console.log('Trails:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch trails:', error);
    throw error;
  }
};

export const updateTrailById = async ({
  id,
  data,
  token,
}: {
  id: string;
  data: any;
  token: string;
}) => {
  try {
    const response = await studioMakerApi.put(`/trails/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Journey updated:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to update journey:', error);
    return { error: error };
  }
};

export const createTrail = async ({
  data,
  token,
}: {
  data: any;
  token: string;
}) => {
  try {
    const response = await studioMakerApi.post('/trails', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Trail created:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to create trail:', error);
    return { error: error };
  }
};

export const deleteTrail = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}) => {
  try {
    const response = await studioMakerApi.delete(`/trails/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Journey deleted:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to delete journey:', error);
    return { error: error };
  }
};

export const getJourney = async (id: string): Promise<Journey> => {
  try {
    const response = await studioMakerApi.get(`/journeys/${id}`);
    console.log('Journey:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch journey:', error);
    throw error;
  }
};

export const updateTrailsOrder = async (
  updatedTrails: Trail[],
): Promise<any> => {
  try {
    const response = await studioMakerApi.patch('/trails/update-trail-order', {
      trails: updatedTrails,
    });
    console.log('Trails updated:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to update trails:', error);
    return { error: error };
  }
};

export const updatePointOrder = async (
  updatedPoints: StartPoint[],
): Promise<any> => {
  try {
    const response = await studioMakerApi.patch('/points/update-point-order', {
      points: updatedPoints,
    });
    console.log('Points updated:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to update points', error);
    return { error: error };
  }
};

export const updateJourneysOrder = async (
  updatedTrails: Journey[],
): Promise<any> => {
  try {
    const response = await studioMakerApi.patch(
      '/journeys/update-journeys-order',
      {
        journeys: updatedTrails,
      },
    );
    console.log('Trails updated:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to update trails:', error);
    return { error: error };
  }
};

export const getContentsByTrailId = async (trailId: string): Promise<any> => {
  try {
    console.log('Fetching contents...');
    const response = await studioMakerApi.get<Content[]>(
      `/contents/trail/${trailId}`,
    );
    return { data: response.data };
  } catch (error) {
    console.error('Erro ao buscar conteúdos:', error);
    return { error: error };
  }
};

export const getContentById = async (id: string): Promise<any> => {
  try {
    const response = await studioMakerApi.get<Content>(`/contents/${id}`);
    return { data: response.data };
  } catch (error) {
    console.error('Erro ao buscar conteúdo:', error);
    return { error: error };
  }
};

export const updateContentOrder = async (
  updatedContents: Content[],
): Promise<any> => {
  try {
    const response = await studioMakerApi.patch(
      '/contents/order/update-order',
      {
        contents: updatedContents,
      },
    );
    console.log('Trails updated:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to update trails:', error);
    return { error: error };
  }
};
export const addJourneyToUser = async ({
  userId,
  journeyId,
}: {
  userId: string;
  journeyId: string;
}) => {
  try {
    const response = await studioMakerApi.patch(
      `/journeys/${userId}/add-journey`,
      {
        journeyId,
      },
    );
    console.log('Journey added to user');
    return response.data;
  } catch (error) {
    console.error('Failed to add journey to user:', error);
    throw error;
  }
};

export const getTrail = async (id: string): Promise<Trail> => {
  try {
    const response = await studioMakerApi.get(`/trails/${id}`);
    console.log('Trail:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch trail:', error);
    throw error;
  }
};

export const findContentsByTrailId = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<Content[]> => {
  try {
    const response = await studioMakerApi.get(`/contents/trail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Contents:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch contents:', error);
    throw error;
  }
};

export const getContent = async (id: string): Promise<Content> => {
  try {
    const response = await studioMakerApi.get(`/contents/${id}`);
    console.log('content:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch content:', error);
    throw error;
  }
};
