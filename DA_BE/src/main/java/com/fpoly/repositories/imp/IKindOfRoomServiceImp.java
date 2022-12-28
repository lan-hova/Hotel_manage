/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.KindOfRoom;
import com.fpoly.repositories.irepo.IKindOfRoomService;
import com.fpoly.repositories.repo.KindOfRoomRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IKindOfRoomServiceImp implements IKindOfRoomService {

	@Autowired
	private KindOfRoomRepository koroomRepo;

	@Override
	public Iterable<KindOfRoom> findAll() {
		return koroomRepo.findAll();
	}

	@Override
	public Optional<KindOfRoom> findById(Integer id) {
		return koroomRepo.findById(id);
	}

	@Override
	public KindOfRoom save(KindOfRoom t) {
		return koroomRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		koroomRepo.deleteById(id);
	}

}
