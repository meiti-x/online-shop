import { profileRepository } from '@profile/repository/profile.repository';

export const profileService = {
  async getUserByPublicId(userId: string) {
    const user = await profileRepository.findByUserId(userId);
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, id, ...safeUser } = user;
    return safeUser;
  },
};
