import { Email } from '@/types/general';
import { UpdateProfileDto } from '@profile/controllers/dto/profile.dto';
import { profileRepository } from '@profile/repository/profile.repository';

export const profileService = {
  async getUserByPublicId(userId: string) {
    const user = await profileRepository.findByUserId(userId);
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, id, ...safeUser } = user;
    return safeUser;
  },

  async getUserByEmail(email: Email) {
    const user = await profileRepository.findByUserEmail(email);
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, id, ...safeUser } = user;
    return safeUser;
  },

  async updateUser(userId: string, data: UpdateProfileDto) {
    const user = await profileRepository.updateByUserId(userId, data);

    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, id, ...safeUser } = user;
    return safeUser;
  },
};
